import JSZip from "jszip";

/**
 * Bump whenever the shape of BookContent changes so cached content gets
 * re-downloaded and re-parsed.
 */
export const CONTENT_VERSION = 2;

/** Rules/front-matter files of a Project Aon book and the content key they map to. */
const SECTION_FILES: Record<string, keyof BookContent> = {
  "dedicate.htm": "dedication",
  "acknwldg.htm": "acknowledgements",
  "tssf.htm": "theStorySoFar",
  "gamerulz.htm": "theGameRules",
  "discplnz.htm": "kaiDisciplines",
  "equipmnt.htm": "equipment",
  "cmbtrulz.htm": "combatRules",
  "levels.htm": "kaiLevels",
  "lorecrcl.htm": "loreCircles",
  "imprvdsc.htm": "improvedDisciplines",
  "kaiwisdm.htm": "kaiWisdom",
  "map.htm": "kaiMap",
  "license.htm": "license",
};

/** Files that only exist for some series. */
const OPTIONAL_FILES = new Set(["lorecrcl.htm", "imprvdsc.htm"]);

const MIME_BY_EXTENSION: Record<string, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  gif: "image/gif",
};

export type ImageResolver = (
  src: string,
  alt: string
) => Promise<{ src: string; alt: string } | null>;

export interface ExtractOptions {
  key: string;
  /** Forces the title (numbered sections). Otherwise the first heading is used. */
  title?: string;
  number?: number;
  images?: ImageResolver;
  footnotes?: Record<string, InlineRun[]>;
  warn?: (message: string) => void;
}

const squash = (text: string | null | undefined) =>
  (text ?? "").replace(/\s+/g, " ").trim();

/** Plain text of an element, footnote markers excluded. */
function plainText(element: Element): string {
  const clone = element.cloneNode(true) as Element;
  clone.querySelectorAll("sup").forEach((sup) => sup.remove());
  return squash(clone.textContent);
}

/** Plain text of a paragraph, useful for titles, search and tests. */
export function paragraphText(paragraph: Paragraph): string {
  if (paragraph.type === "combat" && paragraph.combat) {
    const { name, combatSkill, endurance, enduranceLabel } = paragraph.combat;
    const label = enduranceLabel ? `ENDURANCE (${enduranceLabel})` : "ENDURANCE";
    return `${name}: COMBAT SKILL ${combatSkill} ${label} ${endurance}`;
  }
  if (paragraph.type === "table" && paragraph.rows) {
    return paragraph.rows.map((row) => row.cells.join(" | ")).join("\n");
  }
  return runsText(paragraph.runs);
}

export function runsText(runs: InlineRun[]): string {
  return runs
    .map((run) => (run.kind === "line-break" ? "\n" : run.text))
    .join("")
    .trim();
}

// -----------------------------------------------------------------------------
// Book level
// -----------------------------------------------------------------------------

/**
 * Parses a Project Aon XHTML book zip into immutable, semantic book content.
 * Pure: needs a DOM (browser or jsdom) but no network and no Nuxt.
 */
export async function parseBookZip(
  zipData: ArrayBuffer | Uint8Array | Blob,
  code: string,
  warn: (message: string) => void = () => {}
): Promise<BookContent> {
  const zip = await JSZip.loadAsync(zipData);

  // Index entries by basename. Entries under the book's own folder win.
  const byName = new Map<string, JSZip.JSZipObject>();
  for (const entry of Object.values(zip.files)) {
    if (entry.dir) continue;
    const base = entry.name.split("/").pop()!.toLowerCase();
    const current = byName.get(base);
    if (!current || entry.name.includes(`/lw/${code}/`)) byName.set(base, entry);
  }
  const text = (name: string) => byName.get(name)?.async("text");

  const images = createImageResolver(byName);
  const footnotes = parseFootnotes((await text("footnotz.htm")) ?? "");
  const shared = { images, footnotes, warn };

  const content: Partial<BookContent> = {
    version: CONTENT_VERSION,
    code,
    footnotes,
    numberedSections: [],
  };

  for (const [file, key] of Object.entries(SECTION_FILES)) {
    const html = await text(file);
    if (!html) {
      if (!OPTIONAL_FILES.has(file)) throw new Error(`Book ${code} is missing ${file}`);
      continue;
    }
    (content as Record<string, unknown>)[key] = await extractSection(html, {
      key,
      ...shared,
    });
  }

  for (const [name, entry] of byName) {
    const match = name.match(/^sect(\d+)\.htm$/);
    if (!match) continue;
    const number = parseInt(match[1]!, 10);
    content.numberedSections!.push(
      await extractSection(await entry.async("text"), {
        key: `sect${number}`,
        title: `Section ${number}`,
        number,
        ...shared,
      })
    );
  }
  content.numberedSections!.sort((a, b) => a.number! - b.number!);

  if (content.numberedSections!.length === 0) {
    throw new Error(`Book ${code} has no numbered sections`);
  }
  return content as BookContent;
}

function createImageResolver(byName: Map<string, JSZip.JSZipObject>): ImageResolver {
  const cache = new Map<string, Promise<string | null>>();
  return async (src, alt) => {
    const base = src.split("/").pop()!.toLowerCase();
    if (!cache.has(base)) {
      const entry = byName.get(base);
      const mime = MIME_BY_EXTENSION[base.split(".").pop() ?? ""];
      cache.set(
        base,
        entry && mime
          ? entry.async("base64").then((data) => `data:${mime};base64,${data}`)
          : Promise.resolve(null)
      );
    }
    const dataUrl = await cache.get(base)!;
    return dataUrl ? { src: dataUrl, alt } : null;
  };
}

/**
 * Parses footnotz.htm. Each footnote is `[<a>n</a>] (<a>Section n</a>) text…`
 * and is keyed by the fragment identifier the section refers to (`sect113-1`).
 */
export function parseFootnotes(html: string): Record<string, InlineRun[]> {
  const footnotes: Record<string, InlineRun[]> = {};
  if (!html) return footnotes;
  const doc = new DOMParser().parseFromString(html, "text/html");

  for (const div of Array.from(doc.querySelectorAll(".footnote"))) {
    const paragraph = div.querySelector("p") ?? div;
    const anchors = Array.from(paragraph.querySelectorAll("a"));
    const target = anchors[0]?.getAttribute("href")?.split("#")[1];
    if (!target) continue;

    // Drop the "[n]" back-link and the "(Section n)" origin link, keep the note.
    const clone = paragraph.cloneNode(true) as Element;
    const cloneAnchors = Array.from(clone.querySelectorAll("a"));
    cloneAnchors[0]?.remove();
    const prefix = squash(clone.textContent).slice(0, 4);
    if (cloneAnchors[1] && prefix.startsWith("[] (")) cloneAnchors[1].remove();

    const runs = inlineRuns(clone, {});
    const first = runs[0];
    if (first?.kind === "text") {
      first.text = first.text.replace(/^\s*\[\s*\]\s*(\(\s*\)\s*)?/, "");
      if (!first.text) runs.shift();
    }
    footnotes[target] = runs;
  }
  return footnotes;
}

// -----------------------------------------------------------------------------
// Section level
// -----------------------------------------------------------------------------

interface InlineContext {
  refs?: { id: string; label: string }[];
}

/**
 * Converts one Project Aon page into a Section: a flat list of typed
 * paragraphs whose inline content is a list of runs.
 */
export async function extractSection(html: string, options: ExtractOptions): Promise<Section> {
  const doc = new DOMParser().parseFromString(html, "text/html");
  const main = doc.querySelector(".maintext");
  if (!main) throw new Error(`Main text not found in ${options.key}`);

  const section: Section = {
    key: options.key,
    title: options.title ?? "",
    paragraphs: [],
  };
  if (options.number !== undefined) section.number = options.number;

  const refs: { id: string; label: string }[] = [];
  const context: InlineContext = { refs };
  // The first heading is the page title (or the bare section number); it is
  // consumed, not rendered.
  let titleTaken = false;
  let nextId = 1;

  const add = (paragraph: Omit<Paragraph, "id">) => {
    section.paragraphs.push({ id: nextId++, ...paragraph });
  };

  const addRuns = (type: ParagraphType, element: Element, extra: Partial<Paragraph> = {}) => {
    const runs = inlineRuns(element, context);
    if (runs.length) add({ type, runs, ...extra });
  };

  const addImage = async (img: Element) => {
    if (!options.images) return;
    const src = img.getAttribute("src");
    if (!src) return;
    const image = await options.images(src, img.getAttribute("alt") ?? "");
    if (image) add({ type: "image", runs: [], image });
    else options.warn?.(`${options.key}: image not found in zip: ${src}`);
  };

  const addCombat = (element: Element) => {
    const text = plainText(element);
    const match = text.match(
      /^(.+?):\s*COMBAT SKILL\s*(\d+)\s*ENDURANCE\s*(?:\(([^)]*)\)\s*)?(\d+)\s*$/i
    );
    if (match) {
      const combat: CombatStats = {
        name: match[1]!.trim(),
        combatSkill: parseInt(match[2]!, 10),
        endurance: parseInt(match[4]!, 10),
      };
      if (match[3]) combat.enduranceLabel = squash(match[3]);
      add({ type: "combat", runs: [], combat });
    } else {
      options.warn?.(`${options.key}: unrecognised combat block: ${text}`);
      addRuns("text", element);
    }
  };

  const addTable = (table: Element) => {
    const rows: TableRow[] = [];
    for (const tr of Array.from(table.querySelectorAll("tr"))) {
      const cells = Array.from(tr.children).map((cell) => plainText(cell));
      if (cells.every((cell) => !cell)) continue;
      const header = Array.from(tr.children).every((cell) => cell.tagName === "TH");
      rows.push({ header, cells });
    }
    if (rows.length) add({ type: "table", runs: [], rows });
  };

  const addList = async (list: Element) => {
    const ordered = list.tagName === "OL";
    let index = 0;
    for (const li of Array.from(list.children)) {
      if (li.tagName !== "LI") continue;
      index++;
      const clone = li.cloneNode(true) as Element;
      clone.querySelectorAll("figure, ul, ol, table").forEach((nested) => nested.remove());
      const runs = inlineRuns(clone, context);
      if (runs.length) {
        const text = runsText(runs);
        const marker = ordered ? `${index}.` : /^\d+\s*=/.test(text) ? "" : "•";
        add({ type: "list-item", runs, marker });
      }
      for (const child of Array.from(li.children)) {
        if (["FIGURE", "UL", "OL", "TABLE"].includes(child.tagName)) await block(child);
      }
    }
  };

  async function block(node: Node): Promise<void> {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = squash(node.textContent);
      if (text) add({ type: "text", runs: [{ kind: "text", text }] });
      return;
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return;
    const element = node as Element;
    const tag = element.tagName;

    if (/^H[1-6]$/.test(tag)) {
      if (!titleTaken) {
        titleTaken = true;
        if (!options.title) section.title = plainText(element);
      } else {
        const type: ParagraphType = tag === "H2" ? "header-1" : tag === "H3" ? "header-2" : "header-3";
        addRuns(type, element);
      }
      return;
    }

    switch (tag) {
      case "P": {
        const cls = element.classList;
        if (cls.contains("combat")) return addCombat(element);
        const type: ParagraphType = cls.contains("choice")
          ? "choice"
          : cls.contains("deadend")
            ? "deadend"
            : cls.contains("puzzle")
              ? "puzzle"
              : "text";
        return addRuns(type, element);
      }
      case "FIGURE":
        for (const img of Array.from(element.querySelectorAll("img"))) await addImage(img);
        return;
      case "IMG":
        return addImage(element);
      case "UL":
      case "OL":
        return addList(element);
      case "DL":
        for (const child of Array.from(element.children)) {
          if (child.tagName === "DT") addRuns("header-3", child);
          else if (child.tagName === "DD") addRuns("text", child);
        }
        return;
      case "BLOCKQUOTE":
        return addRuns(element.classList.contains("poetry") ? "poetry" : "text", element);
      case "TABLE":
        return addTable(element);
      case "DIV":
        if (element.classList.contains("signpost")) return addRuns("signpost", element);
        break;
      case "SCRIPT":
      case "STYLE":
        return;
      default:
        if (isInlineTag(tag)) return addRuns("text", element);
    }
    for (const child of Array.from(element.childNodes)) await block(child);
  }

  for (const child of Array.from(main.childNodes)) await block(child);

  // Footnotes referenced from this page are appended so they read in place.
  const seen = new Set<string>();
  for (const ref of refs) {
    if (seen.has(ref.id)) continue;
    seen.add(ref.id);
    const note = options.footnotes?.[ref.id];
    if (!note) {
      options.warn?.(`${options.key}: footnote ${ref.id} not found`);
      continue;
    }
    add({
      type: "footnote",
      footnote: ref.id,
      runs: [{ kind: "text", text: `[${ref.label}] ` }, ...structuredCloneRuns(note)],
    });
  }

  return section;
}

const INLINE_TAGS = new Set(["A", "SPAN", "EM", "I", "CITE", "STRONG", "B", "SUP", "SUB", "BR", "SMALL", "Q"]);
const isInlineTag = (tag: string) => INLINE_TAGS.has(tag);

const structuredCloneRuns = (runs: InlineRun[]): InlineRun[] =>
  runs.map((run) => ({ ...run }));

// -----------------------------------------------------------------------------
// Inline level
// -----------------------------------------------------------------------------

type TextStyle = "em" | "strong" | "smallcaps";

/** Converts the children of an element into normalised inline runs. */
export function inlineRuns(element: Element, context: InlineContext): InlineRun[] {
  const runs: InlineRun[] = [];

  const pushText = (text: string, style?: TextStyle) => {
    const normalised = text.replace(/\s+/g, " ");
    if (!normalised) return;
    const last = runs[runs.length - 1];
    if (last?.kind === "text" && last.style === style) last.text += normalised;
    else runs.push(style ? { kind: "text", text: normalised, style } : { kind: "text", text: normalised });
  };

  const walk = (node: Node, style?: TextStyle): void => {
    if (node.nodeType === Node.TEXT_NODE) return pushText(node.textContent ?? "", style);
    if (node.nodeType !== Node.ELEMENT_NODE) return;
    const el = node as Element;
    const walkChildren = (s = style) => el.childNodes.forEach((child) => walk(child, s));

    switch (el.tagName) {
      case "BR":
        runs.push({ kind: "line-break" });
        return;
      case "A": {
        const href = el.getAttribute("href") ?? "";
        const text = plainText(el);
        const footnote = href.match(/^#(.+)-foot$/);
        if (footnote) {
          const id = footnote[1]!;
          context.refs?.push({ id, label: text });
          runs.push({ kind: "footnote-ref", footnote: id, text });
          return;
        }
        const sect = href.match(/^sect(\d+)\.htm$/);
        if (sect) {
          runs.push({ kind: "section-link", section: parseInt(sect[1]!, 10), text });
          return;
        }
        if (href === "action.htm") return void runs.push({ kind: "action-chart-link", text });
        if (href === "random.htm") return void runs.push({ kind: "random-number-link", text });
        // Cross-book links, map, errata, index pages: keep the words, drop the link.
        return walkChildren();
      }
      case "SUP": {
        // Footnote markers are wrapped in pretty-printed whitespace; keep only the link.
        const anchor = el.querySelector("a");
        if (anchor) return walk(anchor, style);
        return walkChildren();
      }
      case "SPAN":
        return walkChildren(el.classList.contains("smallcaps") ? "smallcaps" : style);
      case "EM":
      case "I":
      case "CITE":
        return walkChildren("em");
      case "STRONG":
      case "B":
        return walkChildren("strong");
      case "FIGURE":
      case "IMG":
      case "SCRIPT":
        return;
      default:
        return walkChildren();
    }
  };

  element.childNodes.forEach((child) => walk(child));
  return normaliseRuns(runs);
}

/** Trims whitespace at the edges and around line breaks; collapses repeated breaks. */
function normaliseRuns(runs: InlineRun[]): InlineRun[] {
  const out: InlineRun[] = [];
  for (const run of runs) {
    const last = out[out.length - 1];
    if (run.kind === "line-break") {
      if (last?.kind === "text") last.text = last.text.replace(/\s+$/, "");
      if (!last || last.kind === "line-break") continue;
      out.push(run);
      continue;
    }
    const copy = { ...run };
    if (!last || last.kind === "line-break") copy.text = copy.text.replace(/^\s+/, "");
    if (copy.text || copy.kind !== "text") out.push(copy);
  }
  while (out.length && out[out.length - 1]!.kind === "line-break") out.pop();
  const last = out[out.length - 1];
  if (last?.kind === "text") last.text = last.text.replace(/\s+$/, "");
  return out.filter((run) => run.kind !== "text" || run.text !== "");
}
