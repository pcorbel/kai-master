import { BOOK_CODES } from "#shared/utils/books";

/** Proxies a book zip from Project Aon so the browser can fetch it same-origin. */
export default defineEventHandler(async (event) => {
  const code = getRouterParam(event, "code") ?? "";
  if (!BOOK_CODES.has(code)) {
    throw createError({ statusCode: 404, statusMessage: "Unknown book code" });
  }

  const zip = await $fetch<ArrayBuffer>(
    `https://www.projectaon.org/en/xhtml/lw/${code}/${code}.zip`,
    { responseType: "arrayBuffer" }
  );

  setHeader(event, "Content-Type", "application/zip");
  setHeader(event, "Cache-Control", "public, max-age=86400");
  return Buffer.from(zip);
});
