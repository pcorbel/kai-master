import { describe, expect, it, beforeAll } from "vitest";
import { CONTENT_VERSION, extractSection, paragraphText, parseBookZip, parseFootnotes } from "~/utils/parser";
import { FAKE_CODE, FAKE_FILES, SWORD_DATA_URL, buildFakeBookZip } from "./fixtures/fake-book";

describe("parseBookZip", () => {
  let content: BookContent;
  const warnings: string[] = [];

  beforeAll(async () => {
    content = await parseBookZip(await buildFakeBookZip(), FAKE_CODE, m => warnings.push(m));
  });

  it("produces versioned content with every rules page and sorted numbered sections", () => {
    expect(content.version).toBe(CONTENT_VERSION);
    expect(content.code).toBe(FAKE_CODE);
    expect(content.numberedSections.map(s => s.number)).toEqual([1, 2, 3]);
    expect(content.numberedSections[0]!.title).toBe("Section 1");
    expect(content.dedication.title).toBe("Dedication");
    expect(content.theStorySoFar.title).toBe("The Story So Far …");
    expect(content.kaiMap.paragraphs.map(p => p.type)).toEqual(["image"]);
    expect(content.loreCircles).toBeUndefined();
    expect(warnings).toEqual([]);
  });

  it("does not ignore navigation pages by accident but never parses them as sections", () => {
    const keys = content.numberedSections.map(s => s.key);
    expect(keys).not.toContain("toc");
    expect(Object.keys(content)).not.toContain("title");
  });

  it("types paragraphs semantically", () => {
    const types = content.numberedSections[0]!.paragraphs.map(p => p.type);
    expect(types).toEqual([
      "text",
      "image",
      "combat",
      "combat",
      "signpost",
      "poetry",
      "table",
      "list-item",
      "list-item",
      "text",
      "choice",
      "choice",
      "footnote",
    ]);
  });

  it("extracts combat stats, including the RESISTANCE points variant", () => {
    const combats = content.numberedSections[0]!.paragraphs.filter(p => p.type === "combat");
    expect(combats.map(p => p.combat)).toEqual([
      { name: "Cave Rat", combatSkill: 9, endurance: 12 },
      { name: "Iron Gate", combatSkill: 13, endurance: 35, enduranceLabel: "RESISTANCE points" },
    ]);
  });

  it("keeps signposts, poetry and tables that the old parser dropped", () => {
    const [section] = content.numberedSections;
    const signpost = section!.paragraphs.find(p => p.type === "signpost")!;
    expect(paragraphText(signpost)).toBe("Northport—2 Miles\nFerry—5 Miles");
    const poetry = section!.paragraphs.find(p => p.type === "poetry")!;
    expect(poetry.runs).toEqual([
      { kind: "text", text: "Over the hill," },
      { kind: "line-break" },
      { kind: "text", text: "under the moon." },
    ]);
    const table = section!.paragraphs.find(p => p.type === "table")!;
    expect(table.rows).toEqual([
      { header: true, cells: ["Item", "Price"] },
      { header: false, cells: ["Rope", "2 Gold Crowns"] },
    ]);
  });

  it("turns links into typed runs and keeps cross-book links as plain words", () => {
    const [section] = content.numberedSections;
    const choice = section!.paragraphs.filter(p => p.type === "choice")[0]!;
    expect(choice.runs).toEqual([
      { kind: "text", text: "If you wish to climb the gate, " },
      { kind: "section-link", section: 2, text: "turn to 2" },
      { kind: "text", text: "." },
    ]);
    const crossBook = section!.paragraphs[9]!;
    expect(crossBook.runs.every(r => r.kind === "text")).toBe(true);
    expect(paragraphText(crossBook)).toBe("You once read about this place in Book 2, Section 79.");
    const intro = section!.paragraphs[0]!;
    expect(intro.runs).toContainEqual({ kind: "action-chart-link", text: "Action Chart" });
    expect(intro.runs).toContainEqual({ kind: "text", text: "ENDURANCE", style: "smallcaps" });
  });

  it("attaches referenced footnotes to the page that cites them", () => {
    const [section] = content.numberedSections;
    const intro = section!.paragraphs[0]!;
    expect(intro.runs).toContainEqual({ kind: "footnote-ref", footnote: "sect1-1", text: "1" });
    // No stray whitespace around the marker.
    expect(paragraphText(intro)).toBe(
      "The gate is shut. You lose 2 ENDURANCE points; note this on your Action Chart.1 A rope lies nearby.",
    );
    const note = section!.paragraphs.at(-1)!;
    expect(note.type).toBe("footnote");
    expect(note.footnote).toBe("sect1-1");
    expect(paragraphText(note)).toBe("[1] You may keep the rope as a Backpack Item.");

    const equipmentNote = content.equipment.paragraphs.at(-1)!;
    expect(equipmentNote.type).toBe("footnote");
    expect(paragraphText(equipmentNote)).toBe("[2] Rope takes one slot on your Action Chart.");
    expect(equipmentNote.runs).toContainEqual({ kind: "action-chart-link", text: "Action Chart" });
  });

  it("resolves images by exact file name, not by substring", () => {
    const image = content.equipment.paragraphs.find(p => p.type === "image")!;
    expect(image.image?.src).toBe(SWORD_DATA_URL);
  });

  it("renders lists with markers and keeps '1 = …' equipment lists unmarked", () => {
    const items = content.equipment.paragraphs.filter(p => p.type === "list-item");
    expect(items.map(p => [p.marker, paragraphText(p)])).toEqual([
      ["", "1 = Sword (Weapons)"],
      ["", "2 = Rope (Backpack Items)2"],
    ]);
    const rules = content.combatRules.paragraphs.filter(p => p.type === "list-item");
    expect(rules.map(p => p.marker)).toEqual(["1.", "2."]);
    expect(paragraphText(rules[0]!)).toBe("Add any bonus to your COMBAT SKILL.");
    const bullets = content.numberedSections[0]!.paragraphs.filter(p => p.type === "list-item");
    expect(bullets.map(p => [p.marker, paragraphText(p)])).toEqual([
      ["•", "Rope"],
      ["•", "Lantern (lit)"],
    ]);
  });

  it("renders definition lists as sub-headings and text with line breaks", () => {
    expect(content.acknowledgements.paragraphs.map(p => [p.type, paragraphText(p)])).toEqual([
      ["header-3", "Transcription"],
      ["text", "First Helper\nSecond Helper"],
    ]);
  });

  it("marks dead ends", () => {
    const [, section2] = content.numberedSections;
    expect(section2!.paragraphs.at(-1)).toMatchObject({ type: "deadend" });
  });
});

describe("extractSection", () => {
  it("uses the first heading as title and maps deeper headings to header levels", async () => {
    const section = await extractSection(FAKE_FILES["discplnz.htm"]!, { key: "kaiDisciplines" });
    expect(section.title).toBe("Kai Disciplines");
    expect(section.paragraphs.map(p => [p.type, paragraphText(p)])).toEqual([
      ["text", "Choose five skills."],
      ["header-3", "Camouflage"],
      ["text", "Blend in with the crowd."],
    ]);
  });

  it("warns and keeps the text when a combat block cannot be parsed", async () => {
    const warnings: string[] = [];
    const html = `<div class="maintext"><h3>7</h3><p class="combat">Something odd</p></div>`;
    const section = await extractSection(html, { key: "sect7", title: "Section 7", number: 7, warn: m => warnings.push(m) });
    expect(section.paragraphs).toEqual([{ id: 1, type: "text", runs: [{ kind: "text", text: "Something odd" }] }]);
    expect(warnings).toHaveLength(1);
  });

  it("throws when the main text is missing", async () => {
    await expect(extractSection("<div>nope</div>", { key: "x" })).rejects.toThrow(/Main text/);
  });
});

describe("parseFootnotes", () => {
  it("keys footnotes by the fragment the section refers to", () => {
    const notes = parseFootnotes(FAKE_FILES["footnotz.htm"]!);
    expect(Object.keys(notes)).toEqual(["sect1-1", "equipmnt-1"]);
    expect(notes["sect1-1"]).toEqual([{ kind: "text", text: "You may keep the rope as a Backpack Item." }]);
  });

  it("returns an empty map for books without footnotes", () => {
    expect(parseFootnotes("")).toEqual({});
  });
});
