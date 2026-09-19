/**
 * Stand-in for Project Aon during the e2e suite.
 *
 * Serves the synthetic fixture book under every real book code, on the same
 * path layout as projectaon.org, so the app under test is pointed here with
 * NUXT_BOOKS_BASE_URL and never touches the network.
 */
import http from "node:http";
import { buildFakeBookZip } from "../tests/fixtures/fake-book";

const port = Number(process.argv[2] ?? 3999);
const zip = Buffer.from(await buildFakeBookZip());

http
  .createServer((request, response) => {
    if (request.url === "/health") {
      response.writeHead(200).end("ok");
      return;
    }
    if (/^\/en\/xhtml\/lw\/[a-z0-9]+\/[a-z0-9]+\.zip$/.test(request.url ?? "")) {
      response.writeHead(200, { "Content-Type": "application/zip", "Content-Length": zip.length }).end(zip);
      return;
    }
    response.writeHead(404).end();
  })
  .listen(port, "127.0.0.1", () => console.log(`books stub listening on http://127.0.0.1:${port}`));
