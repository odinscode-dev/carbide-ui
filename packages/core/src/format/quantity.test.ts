import { describe, expect, it } from "vitest";
import { QUANTITIES, type Unit } from "./quantities.js";
import { formatQuantity } from "./quantity.js";

const NBSP = "\u00a0";

describe("formatQuantity", () => {
  it("assembles number, non-breaking space and unit", () => {
    expect(formatQuantity(2.4, "bar", { locale: "de-DE" })).toBe(`2,40${NBSP}bar`);
    expect(formatQuantity(2.4, "bar", { locale: "en-US" })).toBe(`2.40${NBSP}bar`);
  });

  it("never separates with a regular space", () => {
    expect(formatQuantity(2.4, "bar", { locale: "de-DE" })).not.toContain(" ");
  });

  it("takes the decimal places from the table, not from the caller", () => {
    const expected: Record<Unit, string> = {
      bar: `2,40${NBSP}bar`,
      "l/min": `2,4${NBSP}l/min`,
      ml: `2${NBSP}ml`,
      "mS/cm": `2,40${NBSP}mS/cm`,
      pH: `2,4${NBSP}pH`,
      "\u00b0C": `2,4${NBSP}\u00b0C`,
      "%": `2${NBSP}%`,
    };
    const units: Unit[] = ["bar", "l/min", "ml", "mS/cm", "pH", "\u00b0C", "%"];
    for (const unit of units) {
      expect(formatQuantity(2.4, unit, { locale: "de-DE" })).toBe(expected[unit]);
    }
  });

  it("covers the table completely", () => {
    expect(Object.keys(QUANTITIES).sort()).toEqual(
      ["%", "bar", "l/min", "ml", "mS/cm", "pH", "°C"].sort(),
    );
  });

  it("keeps the decimal places from the decision", () => {
    expect(QUANTITIES.bar.fractionDigits).toBe(2);
    expect(QUANTITIES["l/min"].fractionDigits).toBe(1);
    expect(QUANTITIES.ml.fractionDigits).toBe(0);
    expect(QUANTITIES["mS/cm"].fractionDigits).toBe(2);
    expect(QUANTITIES.pH.fractionDigits).toBe(1);
    expect(QUANTITIES["°C"].fractionDigits).toBe(1);
    expect(QUANTITIES["%"].fractionDigits).toBe(0);
  });

  it("groups large values like formatNumber", () => {
    expect(formatQuantity(1250.5, "l/min", { locale: "de-DE" })).toBe(`1.250,5${NBSP}l/min`);
  });
});
