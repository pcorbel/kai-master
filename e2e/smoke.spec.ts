import { expect, test, type Page } from "@playwright/test";

/**
 * Smoke tier: one reader, one book, start to combat. Runs against the built
 * `.output` with Project Aon replaced by e2e/books-stub.ts, so the prose it
 * asserts on is the synthetic fixture's, not a real book's.
 *
 * Serial on one page: every step builds on the state the previous one left in
 * the browser, which is exactly what a reader does.
 */
test.describe.configure({ mode: "serial" });

let page: Page;

test.beforeAll(async ({ browser }) => {
  page = await browser.newPage();
});

test.afterAll(async () => {
  await page.close();
});

test("a deep link without a downloaded book lands on the library", async () => {
  await page.goto("/section-1");
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByText("A Modern Lone Wolf Reader")).toBeVisible();
  await expect(page.getByRole("button", { name: "CONTINUE" })).toBeDisabled();
});

test("a new game downloads the book and walks the rules to section 1", async () => {
  await page.getByRole("checkbox").check({ force: true });
  await page.getByRole("button", { name: "NEW GAME" }).click();
  await expect(page).toHaveURL(/\/dedication$/);

  for (const next of [
    "acknowledgements",
    "the-story-so-far",
    "the-game-rules",
    "kai-disciplines",
    "equipment",
    "combat-rules",
    "levels-of-kai-training",
    "kai-wisdom",
    "section-1",
  ]) {
    await page.getByText("CONTINUE", { exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`/${next}$`));
  }

  await expect(page.getByText("The gate is shut")).toBeVisible();
  // Footnote content is pulled in from the footnotes page.
  await expect(page.locator(".footnote")).toContainText("You may keep the rope");
  // A table, a signpost and a poem: the constructs the old parser dropped.
  await expect(page.getByRole("cell", { name: "2 Gold Crowns" })).toBeVisible();
  await expect(page.locator(".signpost")).toContainText("Northport");
  await expect(page.getByText("Over the hill,")).toBeVisible();
});

test("turn-to links navigate and the history remembers them", async () => {
  await page.getByText("turn to 2").click();
  await expect(page.locator(".v-toolbar-title")).toContainText("Section 2");
  await expect(page.getByText("Your journey ends here.")).toBeVisible();

  await page.goto("/history");
  await expect(page.locator(".v-main .v-list-item-title", { hasText: "Section 2" })).toBeVisible();
  await expect(page.locator(".v-main .v-list-item-title", { hasText: "Section 1" })).toBeVisible();
});

test("the action chart persists across a reload", async () => {
  await page.goto("/action-chart");
  await page.locator("button .mdi-plus").nth(1).click();
  await page.locator("button .mdi-plus").nth(1).click();
  await page.getByLabel("Kai-Discipline #1").first().fill("Sixth Sense");
  await expect(page.getByText(/^2 \/ \d+$/)).toBeVisible();

  await page.reload();
  await expect(page.getByText(/^2 \/ \d+$/)).toBeVisible();
  await expect(page.getByLabel("Kai-Discipline #1").first()).toHaveValue("Sixth Sense");
});

test("a combat runs off the results table", async () => {
  await page.goto("/section-1");
  await page.getByText("Cave Rat", { exact: false }).click();
  await expect(page).toHaveURL(/\/combat$/);

  await page.getByText("NEXT COMBAT STEP", { exact: true }).click();
  await expect(page).toHaveURL(/\/random-number-table$/);
  await page.locator(".clickable").first().click();
  await page.locator(".text-h1").click();
  await expect(page).toHaveURL(/\/combat$/);

  // Header row, the opening step, the resolved step, and the button row.
  await expect(page.locator(".v-main .v-row")).toHaveCount(4);
});

test("CONTINUE on the library resumes where the reader left off", async () => {
  await page.goto("/");
  await page.getByRole("button", { name: "CONTINUE" }).click();
  await expect(page).toHaveURL(/\/section-1$/);
});
