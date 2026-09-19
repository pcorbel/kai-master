declare global {
  /** Static metadata about a book in the library. */
  interface BookMeta {
    id: number;
    title: string;
    code: string;
    serie: "Kai" | "Magnakai" | "Grand Master";
    disciplines: number;
    randomNumberTable: number[][];
  }

  // ---------------------------------------------------------------------------
  // Book content (immutable, produced by the parser, cached per book)
  // ---------------------------------------------------------------------------

  type InlineRun
    = | { kind: "text"; text: string; style?: "em" | "strong" | "smallcaps" }
      | { kind: "section-link"; section: number; text: string }
      | { kind: "action-chart-link"; text: string }
      | { kind: "random-number-link"; text: string }
      | { kind: "footnote-ref"; footnote: string; text: string }
      | { kind: "line-break" };

  type ParagraphType
    = | "text"
      | "choice"
      | "deadend"
      | "signpost"
      | "poetry"
      | "puzzle"
      | "list-item"
      | "header-1"
      | "header-2"
      | "header-3"
      | "image"
      | "combat"
      | "table"
      | "footnote";

  interface CombatStats {
    name: string;
    combatSkill: number;
    endurance: number;
    /** Some enemies track "RESISTANCE points" or "TARGET points" instead of ENDURANCE. */
    enduranceLabel?: string;
  }

  interface TableRow {
    header: boolean;
    cells: string[];
  }

  interface Paragraph {
    id: number;
    type: ParagraphType;
    /** Inline content. Empty for image, combat and table paragraphs. */
    runs: InlineRun[];
    /** List marker for list items ("•", "1.", …). */
    marker?: string;
    /** Data URL of the illustration for image paragraphs. */
    image?: { src: string; alt: string };
    /** Enemy stats for combat paragraphs. */
    combat?: CombatStats;
    /** Rows for table paragraphs. */
    rows?: TableRow[];
    /** Footnote id for footnote paragraphs. */
    footnote?: string;
  }

  interface Section {
    key: string;
    title: string;
    /** Only for numbered sections. */
    number?: number;
    paragraphs: Paragraph[];
  }

  interface BookContent {
    version: number;
    code: string;
    dedication: Section;
    acknowledgements: Section;
    theStorySoFar: Section;
    theGameRules: Section;
    kaiDisciplines: Section;
    equipment: Section;
    combatRules: Section;
    kaiLevels: Section;
    loreCircles?: Section;
    improvedDisciplines?: Section;
    kaiWisdom: Section;
    kaiMap: Section;
    license: Section;
    /** Sorted by section number. */
    numberedSections: Section[];
    /** Footnote id → footnote content. */
    footnotes: Record<string, InlineRun[]>;
  }

  // ---------------------------------------------------------------------------
  // Game state (mutable, persisted per book)
  // ---------------------------------------------------------------------------

  interface ActionChart {
    combatSkill: number;
    maxCombatSkill: number;
    endurance: number;
    maxEndurance: number;
    beltPouch: number;
    meals: number;
    kaiDisciplines: string[];
    weapons: string[];
    backpackItems: string[];
    specialItems: string[];
    notes: string;
  }

  interface SectionHistory {
    id: number;
    name: string;
    path: string;
    timestamp: string;
  }

  interface Step {
    id: number;
    loneWolfEndurance: number;
    enemyEndurance: number;
    randomNumber: number | null;
  }

  interface Combat {
    name: string;
    inProgress: boolean;
    isEvading: boolean;
    loneWolfCombatSkill: number;
    enemyCombatSkill: number;
    combatRatio: number;
    boundedCombatRatio: number;
    steps: Step[];
  }

  interface BookState {
    code: string;
    /** Version of the parser the cached content was produced with. */
    contentVersion: number;
    isStarted: boolean;
    actionChart: ActionChart;
    combat: Combat;
    history: SectionHistory[];
  }

  interface CombatResult {
    enemyLoss: number | "k";
    lonewolfLoss: number | "k";
  }

  interface CombatResultsRow {
    [combatRatio: number]: CombatResult;
  }

  interface CombatResultsTable {
    [randomNumber: number]: CombatResultsRow;
  }
}

export {};
