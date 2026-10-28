import { describe, expect, it } from "vitest";
import { formatNumber, parseNumber } from "./number.js";

describe("formatNumber", () => {
  it("sets the separator by locale", () => {
    expect(formatNumber(12.4, { locale: "de-DE" })).toBe("12,4");
    expect(formatNumber(12.4, { locale: "en-US" })).toBe("12.4");
  });

  it("groups thousands by locale", () => {
    expect(formatNumber(1250.5, { locale: "de-DE" })).toBe("1.250,5");
    expect(formatNumber(1250.5, { locale: "en-US" })).toBe("1,250.5");
  });

  it("pads to fixed decimal places and rounds accordingly", () => {
    expect(formatNumber(2.4, { locale: "de-DE", fractionDigits: 2 })).toBe("2,40");
    expect(formatNumber(2.456, { locale: "en-US", fractionDigits: 1 })).toBe("2.5");
    expect(formatNumber(12.4, { locale: "de-DE", fractionDigits: 0 })).toBe("12");
  });

  it("takes the system locale when none is given", () => {
    const system = navigator.language;
    expect(formatNumber(1250.5)).toBe(formatNumber(1250.5, { locale: system }));
  });
});

describe("parseNumber", () => {
  it("reads both separators as the same number", () => {
    expect(parseNumber("1.250,5")).toBe(1250.5);
    expect(parseNumber("1,250.5")).toBe(1250.5);
  });

  it("accepts comma and period as the decimal separator", () => {
    expect(parseNumber("12,4")).toBe(12.4);
    expect(parseNumber("12.4")).toBe(12.4);
  });

  it("reads back what formatNumber wrote", () => {
    for (const locale of ["de-DE", "en-US"]) {
      expect(parseNumber(formatNumber(1250.5, { locale }))).toBe(1250.5);
      expect(parseNumber(formatNumber(-0.5, { locale }))).toBe(-0.5);
    }
  });

  it("reads a single separator as the decimal sign, even with three digits", () => {
    expect(parseNumber("1.250")).toBe(1.25);
    expect(parseNumber("1.250,00")).toBe(1250);
  });

  it("accepts multiple thousands separators", () => {
    expect(parseNumber("1.250.000,5")).toBe(1250000.5);
    expect(parseNumber("1,250,000.5")).toBe(1250000.5);
  });

  it("accepts a sign, whitespace and the typographic minus sign", () => {
    expect(parseNumber(" 12,4 ")).toBe(12.4);
    expect(parseNumber("+12.4")).toBe(12.4);
    expect(parseNumber("-12,4")).toBe(-12.4);
    expect(parseNumber("−12,4")).toBe(-12.4);
    expect(parseNumber("1 250,5")).toBe(1250.5);
  });

  it("accepts a leading decimal point without a zero", () => {
    expect(parseNumber(",5")).toBe(0.5);
    expect(parseNumber(".5")).toBe(0.5);
  });

  it("returns null instead of NaN when it is not a number", () => {
    for (const text of ["", "   ", "bar", "12 bar", "1,2,", "1..2", "-", "1e3"]) {
      expect(parseNumber(text)).toBeNull();
    }
  });
});
