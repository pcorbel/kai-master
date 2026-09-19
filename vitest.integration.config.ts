import { defineConfig } from "vitest/config";
import base from "./vitest.config";

/** Slow tests against the real Project Aon zips in .cache/books. */
export default defineConfig({
  ...base,
  test: {
    ...base.test,
    include: ["tests/integration/**/*.test.ts"],
    exclude: [],
    testTimeout: 300_000,
  },
});
