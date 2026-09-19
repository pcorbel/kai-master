import { describe, expect, it } from "vitest";
import { createBookState, migrateBookState } from "~/utils/game";

describe("migrateBookState", () => {
  it("returns a fresh state when nothing was saved", () => {
    expect(migrateBookState(null, "01fftd")).toEqual(createBookState("01fftd"));
  });

  it("upgrades the legacy whole-book save (numbered slots, embedded content)", () => {
    const legacy = {
      id: 1,
      title: "Flight from the Dark",
      code: "01fftd",
      data: { numberedSections: [{ id: "Section 1", paragraphs: [] }] },
      isStarted: true,
      actionChart: {
        combatSkill: 15,
        maxCombatSkill: 15,
        endurance: 20,
        maxEndurance: 25,
        beltPouch: 12,
        meals: 2,
        kaiDisciplines: { kaiDiscipline1: "Camouflage", kaiDiscipline3: "Healing", kaiDiscipline12: "x" },
        weapons: { weapon1: "Axe", weapon2: "" },
        backpackItems: { backpackItem2: "Rope" },
        specialItems: {},
        notes: "hello",
      },
      combat: { name: "Giak", inProgress: false, isEvading: false, loneWolfCombatSkill: 15, enemyCombatSkill: 13, combatRatio: 2, boundedCombatRatio: 2, steps: [] },
      history: [{ id: 0, name: "Dedication", path: "/dedication", timestamp: "2024-01-01T00:00:00.000Z" }, { path: "/section-1" }],
    };

    const state = migrateBookState(legacy, "01fftd");
    expect(state.code).toBe("01fftd");
    expect(state.contentVersion).toBe(0);
    expect(state.isStarted).toBe(true);
    expect(state.actionChart.kaiDisciplines).toHaveLength(12);
    expect(state.actionChart.kaiDisciplines.slice(0, 3)).toEqual(["Camouflage", "", "Healing"]);
    expect(state.actionChart.kaiDisciplines[11]).toBe("x");
    expect(state.actionChart.weapons).toEqual(["Axe", ""]);
    expect(state.actionChart.backpackItems[1]).toBe("Rope");
    expect(state.actionChart.specialItems).toHaveLength(12);
    expect(state.actionChart.notes).toBe("hello");
    expect(state.combat.name).toBe("Giak");
    expect(state.history).toHaveLength(2);
    expect(state.history[1]).toMatchObject({ id: 1, path: "/section-1", name: "" });
    expect(state).not.toHaveProperty("data");
  });

  it("keeps the current shape untouched", () => {
    const current = createBookState("02fotw", 2);
    current.actionChart.kaiDisciplines[0] = "Hunting";
    expect(migrateBookState(JSON.parse(JSON.stringify(current)), "02fotw")).toEqual(current);
  });

  it("drops garbage values", () => {
    const state = migrateBookState({ actionChart: { combatSkill: "12", kaiDisciplines: "nope" }, history: "x" }, "01fftd");
    expect(state.actionChart.combatSkill).toBe(0);
    expect(state.actionChart.kaiDisciplines).toEqual(Array(12).fill(""));
    expect(state.history).toEqual([]);
  });
});
