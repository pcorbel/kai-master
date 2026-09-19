import { BOOK_CODES } from "#shared/utils/books";

/**
 * Proxies a book zip from Project Aon so the browser can fetch it same-origin.
 * The upstream is runtime configuration (NUXT_BOOKS_BASE_URL) so the e2e
 * suite can point it at a stub.
 */
export default defineEventHandler(async (event) => {
  const code = getRouterParam(event, "code") ?? "";
  if (!BOOK_CODES.has(code)) {
    throw createError({ statusCode: 404, statusMessage: "Unknown book code" });
  }

  const { booksBaseUrl } = useRuntimeConfig(event);
  const zip = await $fetch<ArrayBuffer>(
    `${booksBaseUrl}/en/xhtml/lw/${code}/${code}.zip`,
    { responseType: "arrayBuffer" },
  );

  setHeader(event, "Content-Type", "application/zip");
  setHeader(event, "Cache-Control", "public, max-age=86400");
  return Buffer.from(zip);
});
