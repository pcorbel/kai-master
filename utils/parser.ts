import JSZip from "jszip";

const BASE_DIR = "en/xhtml/lw/*/";

// Main function to fetch and process book data
export async function fetchBookdata(code: string) {
  // Fetch and unzip book file
  const url = `/api/books/${code}`;
  const response = await fetchWithRetry(url, {
    responseType: "blob",
    method: "GET",
  });
  const blob = new Blob([response as BlobPart]);
  const zipFile = new File([blob], "downloaded.zip", {
    type: "application/zip",
  });

  const zip = new JSZip();
  const contents = await zip.loadAsync(zipFile);

  // Process each file from the zip
  const data = {} as Data;
  data.numberedSections = [];

  for (const [fileName, file] of Object.entries(contents.files)) {
    if (file.dir) continue;
    const content = await file.async("text");

    // Route each file to correct extractor based on filename
    if (fileName.endsWith("dedicate.htm")) {
      data.dedication = await extractDedication(content);
    } else if (fileName.endsWith("acknwldg.htm")) {
      data.acknowledgements = await extractAcknowledgements(content);
    } else if (fileName.endsWith("tssf.htm")) {
      data.theStorySoFar = await extractTheStorySoFar(content);
    } else if (fileName.endsWith("gamerulz.htm")) {
      data.theGameRules = await extractTheGameRules(content);
    } else if (fileName.endsWith("discplnz.htm")) {
      data.kaiDisciplines = await extractKaiDisciplines(content, contents);
    } else if (fileName.endsWith("equipmnt.htm")) {
      data.equipment = await extractEquipment(content, contents);
    } else if (fileName.endsWith("cmbtrulz.htm")) {
      data.combatRules = await extractCombatRules(content);
    } else if (fileName.endsWith("levels.htm")) {
      data.kaiLevels = await extractKaiLevels(content);
    } else if (fileName.endsWith("lorecrcl.htm")) {
      data.loreCircles = await extractLoreCircles(content);
    } else if (fileName.endsWith("imprvdsc.htm")) {
      data.improvedDisciplines = await extractImprovedDisciplines(content);
    } else if (fileName.endsWith("kaiwisdm.htm")) {
      data.kaiWisdom = await extractKaiWisdom(content);
    } else if (fileName.endsWith("map.htm")) {
      data.kaiMap = await extractKaiMap(content, contents);
    } else if (fileName.endsWith("license.htm")) {
      data.license = await extractLicense(content);
    } else if (fileName.match(/sect\d+\.htm$/i)) {
      const matchResult = fileName.match(
        /sect(\d+)\.htm$/i
      ) as RegExpMatchArray;
      const sectionNumber = matchResult[1];
      const result = await extractNumberedSection(
        content,
        sectionNumber,
        contents
      );
      data.numberedSections.push(result);
    }
  }

  return data;
}

// Main section extraction function used by all specific extractors
export async function extractSection(
  html: string,
  defaultId: string,
  zipContents?: JSZip,
  overrideId?: boolean
): Promise<GenericSection> {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  // Find main content div
  const mainTextDiv =
    doc.querySelector(".maintext") || doc.querySelector(".table-responsive");
  if (!mainTextDiv) throw new Error("Main text div not found");

  const result: GenericSection = { id: defaultId, paragraphs: [] };
  let paragraphId = 1;
  let isFirstHeading = true;

  // Process DOM tree recursively
  async function processNode(node: Node): Promise<void> {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as Element;

      if (isHeadingElement(element)) {
        processHeading(element);
      } else if (element.tagName === "DD") {
        processDefinitionDescription(element);
      } else if (element.tagName === "FIGURE") {
        const img = element.querySelector("img.img-responsive");
        if (img) await processImage(img);
      } else if (element.tagName === "UL" || element.tagName === "OL") {
        const listResults = await processList(element);
        result.paragraphs.push(...listResults);
      } else if (
        isTextElement(element) &&
        !element.closest("ol") &&
        !element.closest("ul")
      ) {
        processTextContent(element);
      } else {
        for (const childNode of element.childNodes) {
          await processNode(childNode);
        }
      }
    } else if (isMainTextNode(node)) {
      processTextNode(node);
    }
  }

  // Helper to check if node is main text content
  function isMainTextNode(node: Node): boolean {
    return node.nodeType === Node.TEXT_NODE && node.parentNode === mainTextDiv;
  }

  // Helper function to identify heading elements
  function isHeadingElement(element: Element): boolean {
    return element.tagName.match(/^H\d$/) !== null || element.tagName === "DT";
  }

  // Helper for paragraphs, list items and definition descriptions
  function isTextElement(element: Element): boolean {
    return ["P", "LI", "DD"].includes(element.tagName);
  }

  // Process section headings and update section ID
  function processHeading(element: Element): void {
    const headingText = element.textContent?.trim() || "";

    if (isFirstHeading && element.tagName.match(/^H\d$/)) {
      isFirstHeading = false;
      if (!overrideId) {
        result.id = headingText || defaultId;
      }
    } else {
      // Handle different header levels
      let headerType: Paragraph["type"];
      switch (element.tagName) {
        case "H2":
          headerType = "header-1";
          break;
        case "H3":
          headerType = "header-2";
          break;
        case "H4":
          headerType = "header-3";
          break;
        case "DT":
          headerType = "header-3";
          break;
        default:
          headerType = "text";
      }
      addParagraph(headerType, headingText);
    }
  }

  // Process lists, handling both numbered and bulleted items plus images
  async function processList(element: Element): Promise<Paragraph[]> {
    const results: Paragraph[] = [];
    let localParagraphId = paragraphId;

    for (const li of Array.from(element.children)) {
      // Extract text content excluding figures
      let content = li.cloneNode(true) as Element;
      content.querySelectorAll("figure").forEach((fig) => fig.remove());
      let textContent = content.textContent?.trim() || "";

      textContent = textContent
        .replace(/\[illustration\]/gi, "")
        .replace(/\s*\n+\s*/g, " ")
        .trim();

      if (textContent) {
        // Handle numbered items (e.g. "1 = Sword") vs regular items
        const match = textContent.match(/^(\d+)\s*=\s*(.+?)(?:\n|$)/);
        if (match) {
          const [, number, itemText] = match;
          results.push({
            id: localParagraphId++,
            type: "text",
            text: `${number} = ${itemText.trim()}`,
          });
        } else {
          results.push({
            id: localParagraphId++,
            type: "text",
            text: `• ${textContent}`,
          });
        }
      }

      // Process any images in the list item
      const figure = li.querySelector("figure");
      if (figure) {
        const img = figure.querySelector("img.img-responsive");
        if (img) {
          const imgResult = await processItemImage(img, localParagraphId++);
          if (imgResult) results.push(imgResult);
        }
      }
    }

    paragraphId = localParagraphId;
    return results;
  }

  // Process definition lists (dt/dd pairs)
  async function processDefinitionDescription(element: Element): Promise<void> {
    const content = element.innerHTML;
    // Split on br tags and clean up each item
    const items = content
      .split(/<br\s*\/?>/i)
      .map((item) => {
        const temp = document.createElement("div");
        temp.innerHTML = item;
        return temp.textContent?.trim() || "";
      })
      .filter((item) => item);

    const joinedText = items.join(", ");
    if (joinedText) addParagraph("text", joinedText);
  }

  // Core image processing logic
  async function processImageToBase64(
    element: Element,
    zipContents: JSZip
  ): Promise<{ imgData: string; imgType: string } | null> {
    const imgSrc = element.getAttribute("src");
    if (!imgSrc) return null;

    const cleanImgSrc = imgSrc.replace(/^\.\//, "").replace(/^\//, "");
    const imgPatterns = [
      cleanImgSrc,
      `${BASE_DIR}${cleanImgSrc}`,
      cleanImgSrc.replace(/^.*[\\\/]/, ""),
      `**/${cleanImgSrc}`,
    ];

    for (const imgPattern of imgPatterns) {
      const matchingFiles = Object.keys(zipContents.files).filter(
        (filename) => {
          const pattern = imgPattern
            .replace("*", "[^/]+")
            .replace(/\//g, "\\/")
            .replace(/\./g, "\\.")
            .replace(/\[/g, "\\[")
            .replace(/\]/g, "\\]");
          return filename.match(new RegExp(pattern, "i"));
        }
      );

      if (matchingFiles.length > 0) {
        const fullImgPath = matchingFiles[0];
        const imgFile = zipContents.file(fullImgPath);
        if (imgFile) {
          try {
            const imgData = await imgFile.async("base64");
            const imgType = imgSrc.toLowerCase().endsWith(".png")
              ? "png"
              : "jpeg";
            return { imgData, imgType };
          } catch (error) {
            console.error(`Error processing image ${fullImgPath}:`, error);
          }
        }
      }
    }
    return null;
  }

  // Process images in list items
  async function processItemImage(
    element: Element,
    id: number
  ): Promise<Paragraph | null> {
    if (!zipContents) return null;

    const result = await processImageToBase64(element, zipContents);
    if (!result) return null;

    return {
      id,
      type: "image",
      text: `<v-img src="data:image/${result.imgType};base64,${result.imgData}" />`,
    };
  }

  // Process standalone images
  async function processImage(img: Element): Promise<void> {
    if (!zipContents) return;

    const result = await processImageToBase64(img, zipContents);
    if (result) {
      addParagraph(
        "image",
        `<v-img src="data:image/${result.imgType};base64,${result.imgData}" />`
      );
    }
  }

  // Process regular text content, handling links and special formatting
  function processTextContent(element: Element): void {
    if (element.classList.contains("combat")) {
      processCombatParagraph(element);
    } else {
      const tempElement = document.createElement("div");
      tempElement.innerHTML = element.innerHTML;

      // Remove footnotes
      const supElements = tempElement.querySelectorAll("sup");
      supElements.forEach((sup) => sup.remove());

      let content = tempElement.innerHTML.trim();

      // Convert links to special components
      content = content.replace(
        /<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/g,
        (match, href, text) => {
          if (href.match(/sect\d+\.htm/)) {
            const number = href.match(/sect(\d+)\.htm/)[1];
            return `<turn-to-link number="${number}" text="${text}" />`;
          } else if (href === "action.htm") {
            return "<action-chart-link />";
          } else if (href === "random.htm") {
            return "<random-number-table-link />";
          }
          return text;
        }
      );

      // Handle special terms
      content = content.replace(/ENDURANCE/g, "ENDURANCE");
      content = content.replace(/COMBAT SKILL/g, "COMBAT SKILL");

      // Clean up HTML entities
      content = content.replace(/&nbsp;/g, " ");
      content = content.replace(/&amp;/g, "&");
      content = content.replace(/&lt;/g, "<");
      content = content.replace(/&gt;/g, ">");
      content = content.replace(/&quot;/g, '"');
      content = content.replace(/&#39;/g, "'");
      content = content.replace(/&mdash;/g, "—");
      content = content.replace(/&ndash;/g, "—");

      // Clean up remaining HTML
      content = content.replace(
        /<(?!\/?(turn-to-link|action-chart-link|random-number-table-link|image-component))[^>]+>/g,
        ""
      );

      content = content.replace(/\s+/g, " ").trim();

      if (content) addParagraph("text", content);
    }
  }

  // Process combat stat blocks
  function processCombatParagraph(element: Element): void {
    const tempElement = document.createElement("div");
    tempElement.innerHTML = element.innerHTML;

    const supElements = tempElement.querySelectorAll("sup");
    supElements.forEach((sup) => sup.remove());

    let content = tempElement.textContent || "";
    content = content.replace(/\s+/g, " ").trim();

    // Extract combat stats and create combat component
    const match = content.match(
      /^(.+?):\s*COMBAT SKILL\s*(\d+)\s*ENDURANCE\s*(\d+)$/i
    );

    if (match) {
      const [, name, combatSkill, endurance] = match;
      const combatButton = `<combat-link name="${name}" combatSkill="${combatSkill}" endurance="${endurance}" />`;
      addParagraph("text", combatButton);
    } else {
      addParagraph("text", content);
    }
  }

  // Process text nodes
  function processTextNode(node: Node): void {
    const textContent = node.textContent?.trim();
    if (textContent) addParagraph("text", textContent);
  }

  // Add paragraph to results
  function addParagraph(type: Paragraph["type"], text: string): void {
    result.paragraphs.push({ id: paragraphId++, type, text });
  }

  // Start processing from root node
  await processNode(mainTextDiv);
  return result;
}

// Specialized extractors for each section type
export async function extractNumberedSection(
  html: string,
  sectionNumber: string,
  zipContents: JSZip
): Promise<GenericSection> {
  return extractSection(html, `Section ${sectionNumber}`, zipContents, true);
}

export async function extractDedication(html: string): Promise<GenericSection> {
  return extractSection(html, "dedication") as Promise<GenericSection>;
}

export async function extractAcknowledgements(
  html: string
): Promise<GenericSection> {
  return extractSection(html, "acknowledgements") as Promise<GenericSection>;
}

export async function extractTheStorySoFar(
  html: string
): Promise<GenericSection> {
  return extractSection(html, "theStorySoFar") as Promise<GenericSection>;
}

export async function extractTheGameRules(
  html: string
): Promise<GenericSection> {
  return extractSection(html, "theGameRules") as Promise<GenericSection>;
}

export async function extractKaiDisciplines(
  html: string,
  zipContents: JSZip
): Promise<GenericSection> {
  return extractSection(
    html,
    "kaiDisciplines",
    zipContents
  ) as Promise<GenericSection>;
}

export async function extractEquipment(
  html: string,
  zipContents: JSZip
): Promise<GenericSection> {
  return extractSection(
    html,
    "equipment",
    zipContents
  ) as Promise<GenericSection>;
}

export async function extractKaiLevels(html: string): Promise<GenericSection> {
  return extractSection(html, "kaiLevels") as Promise<GenericSection>;
}

export async function extractLoreCircles(
  html: string
): Promise<GenericSection> {
  return extractSection(html, "loreCircles") as Promise<GenericSection>;
}

export async function extractImprovedDisciplines(
  html: string
): Promise<GenericSection> {
  return extractSection(html, "improvedDisciplines") as Promise<GenericSection>;
}

export async function extractKaiWisdom(html: string): Promise<GenericSection> {
  return extractSection(html, "kaiWisdom") as Promise<GenericSection>;
}

export async function extractCombatRules(
  html: string
): Promise<GenericSection> {
  return extractSection(html, "combatRules") as Promise<GenericSection>;
}

export async function extractKaiMap(
  html: string,
  zipContents: JSZip
): Promise<GenericSection> {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  const imgElement = doc.querySelector(".img-responsive") as Element;
  const imageSrc = imgElement?.getAttribute("src") || "";

  if (!imageSrc) {
    throw new Error("Map image source not found");
  }

  const imgPattern = `${BASE_DIR}${imageSrc}`;
  const matchingFiles = Object.keys(zipContents.files).filter((filename) =>
    filename.match(new RegExp(imgPattern.replace("*", "[^/]+")))
  );

  if (matchingFiles.length === 0) {
    throw new Error(`Image file not found in zip: ${imgPattern}`);
  }

  const fullImgPath = matchingFiles[0];
  const imgFile = zipContents.file(fullImgPath);

  if (!imgFile) {
    throw new Error(`Image file not found in zip: ${fullImgPath}`);
  }

  try {
    const imgData = await imgFile.async("base64");
    const content = `<v-img :src="data:image/png;base64,${imgData}" />`;
    const result: GenericSection = {
      id: "Map of the Lastlands",
      paragraphs: [
        {
          id: 1,
          type: "text",
          text: content,
        },
      ],
    };

    return result;
  } catch (error) {
    console.error(`Error processing image ${fullImgPath}:`, error);
    throw error;
  }
}

export async function extractLicense(html: string): Promise<GenericSection> {
  return extractSection(html, "license") as Promise<GenericSection>;
}

// Utility function to delay execution
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper function to get error message regardless of error type
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}

// Custom fetch function with retry logic
async function fetchWithRetry(
  url: string,
  options: any = {},
  maxRetries = 3,
  baseDelay = 1000
) {
  let lastError: unknown;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await $fetch(url, {
        ...options,
        retry: attempt + 1,
        onResponse({ response }: { response: any }) {
          // Validate content length if available
          const expectedLength = response.headers.get("content-length");
          const actualLength = response._data?.length;

          if (
            expectedLength &&
            actualLength &&
            expectedLength !== actualLength.toString()
          ) {
            throw new Error("Content length mismatch");
          }
        },
      });

      return response;
    } catch (error: unknown) {
      lastError = error;
      console.error(`Attempt ${attempt + 1} failed:`, error);

      if (attempt === maxRetries - 1) {
        throw new Error(
          `Failed after ${maxRetries} attempts: ${getErrorMessage(error)}`
        );
      }

      // Exponential backoff with jitter
      const jitter = Math.random() * 200;
      const waitTime = baseDelay * Math.pow(2, attempt) + jitter;
      await delay(waitTime);
    }
  }

  throw new Error(`Operation failed: ${getErrorMessage(lastError)}`);
}
