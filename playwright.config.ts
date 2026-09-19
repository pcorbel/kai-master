import { defineConfig, devices } from "@playwright/test";

const APP_PORT = 3100;
const STUB_PORT = 3999;

/**
 * Runs against the built `.output` (run `yarn build` first), with Project Aon
 * replaced by e2e/books-stub.ts so the suite is hermetic.
 */
export default defineConfig({
  testDir: "e2e",
  timeout: 60_000,
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["list"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: `http://127.0.0.1:${APP_PORT}`,
    trace: "retain-on-failure",
  },
  projects: [
    // The app is mobile-first, so the smoke tier runs at phone size.
    { name: "mobile-chromium", use: { ...devices["Pixel 7"] } },
  ],
  webServer: [
    {
      command: `tsx e2e/books-stub.ts ${STUB_PORT}`,
      url: `http://127.0.0.1:${STUB_PORT}/health`,
      reuseExistingServer: !process.env.CI,
      timeout: 30_000,
    },
    {
      command: "node .output/server/index.mjs",
      url: `http://127.0.0.1:${APP_PORT}/api/health`,
      env: {
        HOST: "127.0.0.1",
        PORT: String(APP_PORT),
        NUXT_BOOKS_BASE_URL: `http://127.0.0.1:${STUB_PORT}`,
      },
      reuseExistingServer: false,
      timeout: 60_000,
    },
  ],
});
