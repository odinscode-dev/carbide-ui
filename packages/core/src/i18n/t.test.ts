import { describe, expect, it } from "vitest";
import { en } from "./en.js";
import { t } from "./t.js";

describe("t", () => {
  it("returns the English text from the catalog", () => {
    expect(t("close")).toBe("Close");
    expect(t("next")).toBe("Next");
    expect(t("table.empty")).toBe("No entries");
  });

  it("interpolates placeholders", () => {
    expect(t("table.selected", { count: 1 })).toBe("1 row selected");
  });

  it("picks the plural form via Intl.PluralRules, not via string concatenation", () => {
    expect(t("table.selected", { count: 0 })).toBe("0 rows selected");
    expect(t("table.selected", { count: 1 })).toBe("1 row selected");
    expect(t("table.selected", { count: 2 })).toBe("2 rows selected");
  });

  it("throws when a placeholder has no value", () => {
    expect(() => t("table.selected")).toThrow(/table\.selected/);
  });

  it("keeps the catalog flat so t reads it without path resolution", () => {
    for (const value of Object.values(en)) {
      expect(typeof value).toBe("string");
    }
  });
});
