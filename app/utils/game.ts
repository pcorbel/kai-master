export const ACTION_CHART_SLOTS = {
  kaiDisciplines: 12,
  weapons: 2,
  backpackItems: 8,
  specialItems: 12,
} as const;

export const BELT_POUCH_MAX = 50;

function emptySlots(count: number): string[] {
  return Array.from({ length: count }, () => "");
}

export function createActionChart(): ActionChart {
  return {
    combatSkill: 0,
    maxCombatSkill: 0,
    endurance: 0,
    maxEndurance: 0,
    beltPouch: 0,
    meals: 0,
    kaiDisciplines: emptySlots(ACTION_CHART_SLOTS.kaiDisciplines),
    weapons: emptySlots(ACTION_CHART_SLOTS.weapons),
    backpackItems: emptySlots(ACTION_CHART_SLOTS.backpackItems),
    specialItems: emptySlots(ACTION_CHART_SLOTS.specialItems),
    notes: "",
  };
}

export function createCombat(): Combat {
  return {
    name: "",
    inProgress: false,
    isEvading: false,
    loneWolfCombatSkill: 0,
    enemyCombatSkill: 0,
    combatRatio: 0,
    boundedCombatRatio: 0,
    steps: [],
  };
}

export function createBookState(code: string, contentVersion = 0): BookState {
  return {
    code,
    contentVersion,
    isStarted: false,
    actionChart: createActionChart(),
    combat: createCombat(),
    history: [],
  };
}

/**
 * Converts a numbered-field object from the legacy action chart
 * ({ kaiDiscipline1: "…", kaiDiscipline2: "…" }) into a fixed-size array.
 */
function slotsFrom(value: unknown, count: number): string[] {
  const slots = emptySlots(count);
  if (Array.isArray(value)) {
    value.slice(0, count).forEach((v, i) => (slots[i] = typeof v === "string" ? v : ""));
  } else if (value && typeof value === "object") {
    Object.entries(value as Record<string, unknown>)
      .map(([k, v]) => [parseInt(k.replace(/\D+/g, ""), 10), v] as const)
      .filter(([n]) => n >= 1 && n <= count)
      .forEach(([n, v]) => (slots[n - 1] = typeof v === "string" ? v : ""));
  }
  return slots;
}

/**
 * Upgrades a persisted state of any previous shape to the current BookState.
 * Older versions persisted the whole Book (metadata + content + state) under
 * the same key, so unknown or missing fields are replaced by defaults.
 */
export function migrateBookState(saved: unknown, code: string): BookState {
  const state = createBookState(code);
  if (!saved || typeof saved !== "object") return state;
  const s = saved as Record<string, any>;

  if (typeof s.contentVersion === "number") state.contentVersion = s.contentVersion;
  state.isStarted = Boolean(s.isStarted);

  if (s.actionChart && typeof s.actionChart === "object") {
    const ac = s.actionChart;
    const num = (v: unknown) => (typeof v === "number" && Number.isFinite(v) ? v : 0);
    state.actionChart = {
      combatSkill: num(ac.combatSkill),
      maxCombatSkill: num(ac.maxCombatSkill),
      endurance: num(ac.endurance),
      maxEndurance: num(ac.maxEndurance),
      beltPouch: num(ac.beltPouch),
      meals: num(ac.meals),
      kaiDisciplines: slotsFrom(ac.kaiDisciplines, ACTION_CHART_SLOTS.kaiDisciplines),
      weapons: slotsFrom(ac.weapons, ACTION_CHART_SLOTS.weapons),
      backpackItems: slotsFrom(ac.backpackItems, ACTION_CHART_SLOTS.backpackItems),
      specialItems: slotsFrom(ac.specialItems, ACTION_CHART_SLOTS.specialItems),
      notes: typeof ac.notes === "string" ? ac.notes : "",
    };
  }

  if (s.combat && typeof s.combat === "object" && Array.isArray(s.combat.steps)) {
    state.combat = { ...createCombat(), ...s.combat };
  }

  if (Array.isArray(s.history)) {
    state.history = s.history
      .filter((h: any) => h && typeof h.path === "string")
      .map((h: any, i: number) => ({
        id: i,
        name: String(h.name ?? ""),
        path: h.path,
        timestamp: typeof h.timestamp === "string" ? h.timestamp : new Date(0).toISOString(),
      }));
  }

  return state;
}
