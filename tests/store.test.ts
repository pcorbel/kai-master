import { beforeEach, describe, expect, it, vi } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import type * as Books from "#shared/utils/books";
import { FAKE_CODE, buildFakeBookZip } from "./fixtures/fake-book";

// In-memory replacement for IndexedDB.
const memory = new Map<string, unknown>();
vi.mock("~/utils/storage", () => ({
  bookStorage: {
    getItem: async (key: string) => memory.get(key) ?? null,
    setItem: async (key: string, value: unknown) => {
      memory.set(key, JSON.parse(JSON.stringify(value)));
    },
    removeItem: async (key: string) => {
      memory.delete(key);
    },
    flush: async () => {},
  },
  stateKey: (code: string) => `book-${code}`,
  contentKey: (code: string) => `content-${code}`,
}));

// The store downloads through Nuxt's global $fetch.
const fetchMock = vi.fn();
Object.assign(globalThis, { $fetch: fetchMock });

// Pretend the fake book is part of the library so the store can select it.
vi.mock("#shared/utils/books", async (importOriginal) => {
  const original = await importOriginal<typeof Books>();
  const fake = { ...original.BOOKS[0]!, id: 99, code: "99test", title: "Test Book" };
  return { BOOKS: [...original.BOOKS, fake], BOOK_CODES: new Set([...original.BOOK_CODES, "99test"]) };
});

const { useAppStore } = await import("~/stores/app");
const { CONTENT_VERSION } = await import("~/utils/parser");

describe("app store", () => {
  beforeEach(async () => {
    memory.clear();
    fetchMock.mockReset();
    fetchMock.mockImplementation(async () => (await buildFakeBookZip()).buffer);
    setActivePinia(createPinia());
  });

  it("starts with the first book and no content", async () => {
    const app = useAppStore();
    await app.initialize();
    expect(app.book.code).toBe("01fftd");
    expect(app.hasContent).toBe(false);
    expect(app.resumePath).toBeNull();
  });

  it("downloads, parses and caches content on a new game", async () => {
    const app = useAppStore();
    await app.initialize();
    await app.selectBook(FAKE_CODE);
    await app.startNewGame();

    expect(fetchMock).toHaveBeenCalledWith(`/api/books/${FAKE_CODE}`, expect.objectContaining({ responseType: "arrayBuffer" }));
    expect(app.hasContent).toBe(true);
    expect(app.content?.numberedSections).toHaveLength(3);
    expect(app.book.contentVersion).toBe(CONTENT_VERSION);
    expect(memory.get(`content-${FAKE_CODE}`)).toMatchObject({ code: FAKE_CODE, version: CONTENT_VERSION });

    // Content is cached: a second game for the same book does not download again.
    await app.startNewGame();
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("persists only the small game state on changes, not the content", async () => {
    const app = useAppStore();
    await app.initialize();
    await app.selectBook(FAKE_CODE);
    await app.startNewGame();

    app.addHistory("Section 1", "/section-1");
    app.adjustEndurance(5);
    await new Promise(resolve => setTimeout(resolve, 0));

    const saved = memory.get(`book-${FAKE_CODE}`) as BookState;
    expect(saved.history.map(h => h.path)).toEqual(["/section-1"]);
    expect(saved.actionChart.endurance).toBe(5);
    expect(saved).not.toHaveProperty("content");
    expect(saved).not.toHaveProperty("data");
  });

  it("restores state and cached content for a book that was played before", async () => {
    const first = useAppStore();
    await first.initialize();
    await first.selectBook(FAKE_CODE);
    await first.startNewGame();
    first.addHistory("Section 3", "/section-3");
    first.book.isStarted = true;
    await new Promise(resolve => setTimeout(resolve, 0));

    setActivePinia(createPinia());
    const second = useAppStore();
    second.currentBookCode = FAKE_CODE;
    await second.initialize();
    expect(second.hasContent).toBe(true);
    expect(second.resumePath).toBe("/section-3");
    expect(second.book.isStarted).toBe(true);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("re-downloads when the cached content comes from an older parser", async () => {
    memory.set(`content-${FAKE_CODE}`, { code: FAKE_CODE, version: CONTENT_VERSION - 1 });
    const app = useAppStore();
    await app.initialize();
    await app.selectBook(FAKE_CODE);
    expect(app.hasContent).toBe(false);
    await app.ensureContent();
    expect(app.hasContent).toBe(true);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("locks the maximum stats once the adventure has started", () => {
    const app = useAppStore();
    app.adjustCombatSkill(10);
    app.adjustEndurance(20);
    expect(app.book.actionChart).toMatchObject({ combatSkill: 10, maxCombatSkill: 10, endurance: 20, maxEndurance: 20 });
    app.book.isStarted = true;
    app.adjustCombatSkill(2);
    app.adjustEndurance(-5);
    expect(app.book.actionChart).toMatchObject({ combatSkill: 12, maxCombatSkill: 10, endurance: 15, maxEndurance: 20 });
    app.adjustEndurance(-100);
    expect(app.book.actionChart.endurance).toBe(0);
    app.adjustBeltPouch(80);
    expect(app.book.actionChart.beltPouch).toBe(50);
    app.adjustMeals(-1);
    expect(app.book.actionChart.meals).toBe(0);
  });

  it("runs a combat round from the results table and ends it on a kill", () => {
    const app = useAppStore();
    app.adjustCombatSkill(15);
    app.adjustEndurance(25);
    app.startCombat({ name: "Giak", combatSkill: 13, endurance: 10 });
    expect(app.book.combat).toMatchObject({ inProgress: true, combatRatio: 2, boundedCombatRatio: 2 });

    app.handleCombatStep(5); // ratio 2, random 5 → enemy loses 8, Lone Wolf loses 2
    expect(app.book.combat.steps.at(-1)).toMatchObject({ loneWolfEndurance: 23, enemyEndurance: 2, randomNumber: 5 });
    expect(app.book.actionChart.endurance).toBe(23);
    expect(app.book.combat.inProgress).toBe(true);

    app.handleCombatStep(0); // random 0 → enemy loses 14 → dead
    expect(app.book.combat.steps.at(-1)).toMatchObject({ loneWolfEndurance: 23, enemyEndurance: 0 });
    expect(app.book.combat.inProgress).toBe(false);

    app.handleCombatStep(3); // ignored once the combat is over
    expect(app.book.combat.steps).toHaveLength(3);
  });

  it("evading takes the hit without hurting the enemy and ends the combat", () => {
    const app = useAppStore();
    app.adjustCombatSkill(10);
    app.adjustEndurance(20);
    app.startCombat({ name: "Drakkar", combatSkill: 20, endurance: 30 });
    app.book.combat.isEvading = true;
    app.handleCombatStep(4); // ratio -10, random 4 → LW loses 7
    expect(app.book.combat.steps.at(-1)).toMatchObject({ loneWolfEndurance: 13, enemyEndurance: 30 });
    expect(app.book.combat.inProgress).toBe(false);
  });

  it("does not record the same page twice in a row", () => {
    const app = useAppStore();
    app.addHistory("Section 1", "/section-1");
    app.addHistory("Section 1", "/section-1");
    app.addHistory("Section 2", "/section-2");
    expect(app.book.history.map(h => h.path)).toEqual(["/section-1", "/section-2"]);
  });

  it("bounds extreme combat ratios to the table", () => {
    const app = useAppStore();
    app.adjustCombatSkill(40);
    app.startCombat({ name: "Weakling", combatSkill: 1, endurance: 5 });
    expect(app.book.combat.combatRatio).toBe(39);
    expect(app.book.combat.boundedCombatRatio).toBe(11);
  });
});
