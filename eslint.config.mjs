// @ts-check
import withNuxt from "./.nuxt/eslint.config.mjs";

/**
 * Formatting comes from `eslint.config.stylistic` in nuxt.config.ts: there is
 * no Prettier in this repo, so `yarn lint:fix` is the formatter.
 */
export default withNuxt(
  {
    ignores: [
      "eslint.config.mjs",
      ".cache",
      "coverage",
      "test-results",
      "playwright-report",
    ],
  },
  {
    files: ["**/*.ts", "**/*.vue"],
    rules: {
      // Ban any: use unknown and narrow explicitly.
      "@typescript-eslint/no-explicit-any": "error",
      // Force `import type` for type-only imports.
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports", fixStyle: "inline-type-imports" },
      ],
    },
  },
  {
    rules: {
      // <script setup> only, with type-based props.
      "vue/component-api-style": ["error", ["script-setup"]],
      "vue/define-props-declaration": ["error", "type-based"],
      "vue/define-emits-declaration": ["error", "type-based"],
      "vue/no-unused-vars": "error",
      // Book text is rendered from typed runs, never as raw HTML.
      "vue/no-v-html": "error",
      // == hides null/undefined bugs; == null is the one useful exception.
      "eqeqeq": ["error", "smart"],
      "no-console": ["error", { allow: ["warn", "error"] }],
    },
  },
  {
    /** Tests, tooling and the e2e stub print for humans. */
    files: ["tests/**", "scripts/**", "e2e/**"],
    rules: { "no-console": "off" },
  },
  {
    /**
     * The legacy save format is untyped by definition: the migration reads
     * whatever an older version of the app persisted.
     */
    files: ["app/utils/game.ts"],
    rules: { "@typescript-eslint/no-explicit-any": "off" },
  },
);
