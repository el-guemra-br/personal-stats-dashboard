import { describe, expect, it } from "vitest";
import {
  formatCompactNumber,
  formatFullNumber,
  levelFromValue,
  safeDivide,
} from "./formatting";

describe("formatting utilities", () => {
  it("formats compact numbers", () => {
    expect(formatCompactNumber(15300)).toBe("15.3K");
  });

  it("formats full numbers", () => {
    expect(formatFullNumber(1200000)).toBe("1,200,000");
  });

  it("returns activity level based on thresholds", () => {
    expect(levelFromValue(120, 100, 40)).toBe("high");
    expect(levelFromValue(60, 100, 40)).toBe("moderate");
    expect(levelFromValue(20, 100, 40)).toBe("low");
  });

  it("safely divides values", () => {
    expect(safeDivide(20, 5)).toBe(4);
    expect(safeDivide(20, 0)).toBe(0);
  });
});
