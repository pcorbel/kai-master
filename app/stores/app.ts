import { defineStore } from "pinia";
import { markRaw } from "vue";
import { BOOKS } from "#shared/utils/books";
import { bookStorage, contentKey, stateKey } from "~/utils/storage";
import { BELT_POUCH_MAX, createBookState, migrateBookState } from "~/utils/game";
import { CONTENT_VERSION, parseBookZip } from "~/utils/parser";
import { computeNewEndurance, getResult } from "~/utils/combat";

const DEFAULT_CODE = BOOKS[0]!.code;

export const useAppStore = defineStore("app", {
  state: () => ({
    currentBookCode: DEFAULT_CODE,
    downloadInProgress: false,
    isLicenseAccepted: false,
    navigation: {
      showAppbar: false,
      showBottomNav: false,
      title: "",
    },
    /** Mutable game state of the selected book (persisted on every change). */
    book: createBookState(DEFAULT_CODE),
    /** Immutable parsed content of the selected book (persisted once, kept non-reactive). */
    content: null as BookContent | null,
    books: BOOKS,
  }),

  getters: {
    meta: (state): BookMeta =>
      state.books.find(book => book.code === state.book.code) ?? state.books[0]!,

    hasContent: (state): boolean =>
      state.content !== null
      && state.content.code === state.book.code
      && state.content.version === CONTENT_VERSION,

    /** Path to resume at: the last page the player visited. */
    resumePath: (state): string | null =>
      state.book.history[state.book.history.length - 1]?.path ?? null,
  },

  actions: {
    /** Loads the selected book from storage and starts persisting state changes. */
    async initialize() {
      await this.loadBook(this.currentBookCode);
      this.$subscribe(() => {
        this.saveState();
      });
    },

    /** Loads the state and cached content of a book. */
    async loadBook(code: string) {
      this.currentBookCode = code;
      const [savedState, savedContent] = await Promise.all([
        bookStorage.getItem<unknown>(stateKey(code)),
        bookStorage.getItem<BookContent>(contentKey(code)),
      ]);
      this.book = migrateBookState(savedState, code);
      this.content
        = savedContent && savedContent.code === code && savedContent.version === CONTENT_VERSION
          ? markRaw(savedContent)
          : null;
    },

    /** Switches the library selection to another book. */
    async selectBook(code: string) {
      if (code === this.book.code) return;
      await bookStorage.flush();
      await this.loadBook(code);
    },

    saveState() {
      return bookStorage.setItem(stateKey(this.book.code), this.book);
    },

    /** Downloads and parses the book from Project Aon, then caches the result. */
    async downloadContent() {
      const code = this.book.code;
      const zip = await $fetch<ArrayBuffer>(`/api/books/${code}`, {
        responseType: "arrayBuffer",
        retry: 2,
        retryDelay: 1000,
      });
      const content = await parseBookZip(zip, code, message => console.warn(message));
      await bookStorage.setItem(contentKey(code), content);
      this.content = markRaw(content);
      this.book.contentVersion = content.version;
    },

    async ensureContent() {
      if (!this.hasContent) await this.downloadContent();
    },

    /** Erases the progress of the selected book and makes sure its content is available. */
    async startNewGame() {
      this.book = createBookState(this.book.code);
      await this.ensureContent();
      this.book.contentVersion = CONTENT_VERSION;
    },

    getSection(number: number): Section | null {
      return this.content?.numberedSections.find(section => section.number === number) ?? null;
    },

    // --- Action Chart -------------------------------------------------------

    adjustCombatSkill(delta: number) {
      const chart = this.book.actionChart;
      chart.combatSkill = Math.max(0, chart.combatSkill + delta);
      if (!this.book.isStarted) chart.maxCombatSkill = chart.combatSkill;
    },

    adjustEndurance(delta: number) {
      const chart = this.book.actionChart;
      chart.endurance = Math.max(0, chart.endurance + delta);
      if (!this.book.isStarted) chart.maxEndurance = chart.endurance;
    },

    adjustBeltPouch(delta: number) {
      const chart = this.book.actionChart;
      chart.beltPouch = Math.min(BELT_POUCH_MAX, Math.max(0, chart.beltPouch + delta));
    },

    adjustMeals(delta: number) {
      const chart = this.book.actionChart;
      chart.meals = Math.max(0, chart.meals + delta);
    },

    // --- Combat -------------------------------------------------------------

    startCombat(enemy: CombatStats) {
      const combatRatio = this.book.actionChart.combatSkill - enemy.combatSkill;
      this.book.combat = {
        name: enemy.name,
        inProgress: true,
        isEvading: false,
        loneWolfCombatSkill: this.book.actionChart.combatSkill,
        enemyCombatSkill: enemy.combatSkill,
        combatRatio,
        boundedCombatRatio: Math.max(-11, Math.min(11, combatRatio)),
        steps: [
          {
            id: 0,
            loneWolfEndurance: this.book.actionChart.endurance,
            enemyEndurance: enemy.endurance,
            randomNumber: null,
          },
        ],
      };
    },

    handleCombatStep(randomNumber: number) {
      const combat = this.book.combat;
      const lastStep = combat.steps[combat.steps.length - 1];
      if (!combat.inProgress || !lastStep) return;

      const result = getResult(randomNumber, combat.boundedCombatRatio);
      const step: Step = {
        id: combat.steps.length,
        loneWolfEndurance: computeNewEndurance(lastStep.loneWolfEndurance, result.lonewolfLoss),
        enemyEndurance: combat.isEvading
          ? lastStep.enemyEndurance
          : computeNewEndurance(lastStep.enemyEndurance, result.enemyLoss),
        randomNumber,
      };

      combat.steps.push(step);
      this.book.actionChart.endurance = step.loneWolfEndurance;

      if (step.loneWolfEndurance === 0 || step.enemyEndurance === 0 || combat.isEvading) {
        combat.inProgress = false;
      }
    },

    // --- History ------------------------------------------------------------

    addHistory(name: string, path: string) {
      const history = this.book.history;
      if (history[history.length - 1]?.path === path) return;
      history.push({ id: history.length, name, path, timestamp: new Date().toISOString() });
    },
  },

  persist: {
    pick: ["currentBookCode", "isLicenseAccepted"],
  },
});
