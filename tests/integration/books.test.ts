/**
 * Runs the parser against the real Project Aon zips in .cache/books
 * (populate with `yarn books:download`). Skipped when the zips are absent.
 */
import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { BOOKS } from "#shared/utils/books";
import { paragraphText, parseBookZip } from "~/utils/parser";

const CACHE = path.resolve(__dirname, "../../.cache/books");
const zips = fs.existsSync(CACHE) ? fs.readdirSync(CACHE).filter(f => f.endsWith(".zip")) : [];

const squash = (s: string) => s.replace(/\s+/g, " ").trim();

describe.skipIf(zips.length === 0)("Project Aon books", () => {
  for (const book of BOOKS) {
    const file = path.join(CACHE, `${book.code}.zip`);
    it.skipIf(!fs.existsSync(file))(`${book.code} parses completely`, async () => {
      const warnings: string[] = [];
      const zip = fs.readFileSync(file);
      const content = await parseBookZip(zip, book.code, m => warnings.push(m));

      expect(content.numberedSections.length).toBeGreaterThanOrEqual(300);
      expect(content.numberedSections.map(s => s.number)).toEqual(
        content.numberedSections.map((_, i) => i + 1),
      );
      expect(content.kaiMap.paragraphs.some(p => p.type === "image")).toBe(true);
      if (book.serie === "Magnakai") expect(content.loreCircles).toBeDefined();
      if (book.serie !== "Kai") expect(content.improvedDisciplines).toBeDefined();
      expect(Object.keys(content.footnotes).length).toBeGreaterThan(0);
      expect(warnings, warnings.join("\n")).toEqual([]);

      // Every piece of source text in every section must survive parsing.
      const { default: JSZip } = await import("jszip");
      const archive = await JSZip.loadAsync(zip);
      let sourceNodes = 0;
      const lost: string[] = [];
      let choices = 0;
      let combats = 0;
      for (const section of content.numberedSections) {
        const entry = Object.values(archive.files).find(f => f.name.endsWith(`/sect${section.number}.htm`))!;
        const doc = new DOMParser().parseFromString(await entry.async("text"), "text/html");
        const main = doc.querySelector(".maintext")!;
        choices += main.querySelectorAll("p.choice").length;
        combats += main.querySelectorAll("p.combat").length;
        // The heading holds the bare section number, which becomes the title.
        const output = squash(`${section.number} ${section.paragraphs.map(paragraphText).join(" ")}`);
        const walker = doc.createTreeWalker(main, NodeFilter.SHOW_TEXT);
        let node: Node | null;
        while ((node = walker.nextNode())) {
          const text = squash(node.textContent ?? "");
          if (text.length < 2) continue;
          sourceNodes++;
          if (!output.includes(text)) lost.push(`sect${section.number}: ${text.slice(0, 60)}`);
        }
      }
      expect(lost, lost.slice(0, 10).join("\n")).toEqual([]);
      expect(sourceNodes).toBeGreaterThan(1000);

      const parsedChoices = content.numberedSections.flatMap(s => s.paragraphs).filter(p => p.type === "choice").length;
      const parsedCombats = content.numberedSections.flatMap(s => s.paragraphs).filter(p => p.type === "combat").length;
      expect(parsedChoices).toBe(choices);
      expect(parsedCombats).toBe(combats);
    });
  }
});
