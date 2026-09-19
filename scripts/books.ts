/**
 * Book tooling for development:
 *   yarn books:download   fetch the Project Aon zips into .cache/books
 *   yarn books:dump       parse them and write clean JSON into .cache/books/json
 *
 * The JSON dump is the same content the app caches in IndexedDB, and the
 * starting point for any other reader (the planned GBA port included).
 */
import fs from "node:fs";
import path from "node:path";
import { JSDOM } from "jsdom";
import { BOOKS } from "../shared/utils/books";

const CACHE = path.resolve(import.meta.dirname, "../.cache/books");
const JSON_DIR = path.join(CACHE, "json");
const command = process.argv[2];
const only = process.argv[3];
const books = BOOKS.filter((book) => !only || book.code === only);

async function download() {
  fs.mkdirSync(CACHE, { recursive: true });
  for (const book of books) {
    const target = path.join(CACHE, `${book.code}.zip`);
    if (fs.existsSync(target)) {
      console.log(`${book.code}: already downloaded`);
      continue;
    }
    const url = `https://www.projectaon.org/en/xhtml/lw/${book.code}/${book.code}.zip`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`${url}: HTTP ${response.status}`);
    fs.writeFileSync(target, Buffer.from(await response.arrayBuffer()));
    console.log(`${book.code}: downloaded ${(fs.statSync(target).size / 1048576).toFixed(1)} MB`);
  }
}

async function dump() {
  // The parser needs a DOM.
  const dom = new JSDOM("");
  Object.assign(globalThis, { DOMParser: dom.window.DOMParser, Node: dom.window.Node });
  const { parseBookZip, paragraphText } = await import("../app/utils/parser");

  fs.mkdirSync(JSON_DIR, { recursive: true });
  for (const book of books) {
    const file = path.join(CACHE, `${book.code}.zip`);
    if (!fs.existsSync(file)) {
      console.log(`${book.code}: missing, run "yarn books:download" first`);
      continue;
    }
    const warnings: string[] = [];
    const content = await parseBookZip(fs.readFileSync(file), book.code, (m) => warnings.push(m));
    const json = JSON.stringify(content);
    fs.writeFileSync(path.join(JSON_DIR, `${book.code}.json`), json);

    // A text-only copy without the base64 images is handy for diffing.
    const textOnly = JSON.stringify(content, (key, value) =>
      key === "image" && value && typeof value === "object" ? { ...value, src: "(omitted)" } : value
    );
    fs.writeFileSync(path.join(JSON_DIR, `${book.code}.text.json`), textOnly);

    const paragraphs = content.numberedSections.flatMap((s) => s.paragraphs);
    const count = (type: ParagraphType) => paragraphs.filter((p) => p.type === type).length;
    console.log(
      `${book.code}: ${content.numberedSections.length} sections, ${count("choice")} choices, ` +
        `${count("combat")} combats, ${count("image")} images, ${count("footnote")} footnotes, ` +
        `${(json.length / 1048576).toFixed(1)} MB (${(textOnly.length / 1024).toFixed(0)} KB text)` +
        (warnings.length ? `\n  warnings: ${warnings.join("; ")}` : "")
    );
    void paragraphText;
  }
}

if (command === "download") await download();
else if (command === "dump") await dump();
else {
  console.error("usage: tsx scripts/books.ts <download|dump> [code]");
  process.exit(1);
}
