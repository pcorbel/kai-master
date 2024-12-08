declare global {
  interface Book {
    id: number;
    title: string;
    code: string;
    serie: string;
    disciplines: number;
    randomNumberTable: number[][];
    data: Data;
    actionChart: ActionChart;
    combat: Combat;
    history: SectionHistory[];
    isInitialized: boolean;
    isStarted: boolean;
  }

  interface Data {
    dedication: GenericSection;
    acknowledgements: GenericSection;
    theStorySoFar: GenericSection;
    theGameRules: GenericSection;
    kaiDisciplines: GenericSection;
    equipment: GenericSection;
    combatRules: GenericSection;
    kaiLevels: GenericSection;
    loreCircles: GenericSection;
    improvedDisciplines: GenericSection;
    kaiWisdom: GenericSection;
    kaiMap: GenericSection;
    numberedSections: GenericSection[];
    license: GenericSection;
  }

  interface ActionChart {
    combatSkill: number;
    maxCombatSkill: number;
    endurance: number;
    maxEndurance: number;
    beltPouch: number;
    meals: number;
    kaiDisciplines: {
      kaiDiscipline1: string;
      kaiDiscipline2: string;
      kaiDiscipline3: string;
      kaiDiscipline4: string;
      kaiDiscipline5: string;
      kaiDiscipline6: string;
      kaiDiscipline7: string;
      kaiDiscipline8: string;
      kaiDiscipline9: string;
    };
    weapons: {
      weapon1: string;
      weapon2: string;
    };
    backpackItems: {
      backpackItem1: string;
      backpackItem2: string;
      backpackItem3: string;
      backpackItem4: string;
      backpackItem5: string;
      backpackItem6: string;
      backpackItem7: string;
      backpackItem8: string;
    };
    specialItems: {
      specialItem1: string;
      specialItem2: string;
      specialItem3: string;
      specialItem4: string;
      specialItem5: string;
      specialItem6: string;
      specialItem7: string;
      specialItem8: string;
      specialItem9: string;
      specialItem10: string;
      specialItem11: string;
      specialItem12: string;
    };
    notes: string;
  }

  interface GenericSection {
    id: string;
    paragraphs: Paragraph[];
  }

  interface Paragraph {
    id: number;
    type: "text" | "header-1" | "header-2" | "header-3" | "image";
    text: string;
  }

  interface ComponentPart {
    isComponent: true;
    componentName: string;
    props: Record<string, string>;
  }

  interface TextPart {
    isComponent: false;
    text: string;
  }

  type ContentPart = ComponentPart | TextPart;

  interface SectionHistory {
    id: number;
    name: string;
    path: string;
    timestamp: string;
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

  interface Step {
    id: number;
    loneWolfEndurance: number;
    enemyEndurance: number;
    randomNumber: number | null;
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

  interface StorageConfig {
    name: string;
    storeName: string;
  }
}

export {};
