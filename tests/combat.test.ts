import { describe, expect, it } from "vitest";
import { computeNewEndurance, getResult } from "~/utils/combat";

describe("combat results table", () => {
  it("covers every random number and every bounded combat ratio", () => {
    for (let random = 0; random <= 9; random++) {
      for (let ratio = -11; ratio <= 11; ratio++) {
        const result = getResult(random, ratio);
        expect(result, `random ${random}, ratio ${ratio}`).toBeDefined();
        expect(result.enemyLoss === "k" || result.enemyLoss >= 0).toBe(true);
        expect(result.lonewolfLoss === "k" || result.lonewolfLoss >= 0).toBe(true);
      }
    }
  });

  it("matches a few well-known cells", () => {
    expect(getResult(0, 0)).toEqual({ enemyLoss: 12, lonewolfLoss: 0 });
    expect(getResult(1, -11)).toEqual({ enemyLoss: 0, lonewolfLoss: "k" });
    expect(getResult(9, 11)).toEqual({ enemyLoss: "k", lonewolfLoss: 0 });
    expect(getResult(5, 3)).toEqual({ enemyLoss: 9, lonewolfLoss: 2 });
  });

  it("gets more favourable to Lone Wolf as the ratio increases", () => {
    for (let random = 1; random <= 9; random++) {
      for (let ratio = -11; ratio < 11; ratio++) {
        const a = getResult(random, ratio);
        const b = getResult(random, ratio + 1);
        const enemy = (r: number | "k") => (r === "k" ? Infinity : r);
        expect(enemy(b.enemyLoss)).toBeGreaterThanOrEqual(enemy(a.enemyLoss));
        expect(enemy(b.lonewolfLoss)).toBeLessThanOrEqual(enemy(a.lonewolfLoss));
      }
    }
  });
});

describe("computeNewEndurance", () => {
  it("never goes below zero and treats k as a kill", () => {
    expect(computeNewEndurance(10, 3)).toBe(7);
    expect(computeNewEndurance(2, 5)).toBe(0);
    expect(computeNewEndurance(30, "k")).toBe(0);
  });
});
