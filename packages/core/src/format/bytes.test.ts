import { describe, expect, it } from "vitest";
import { formatBytes } from "./bytes.js";

describe("formatBytes", () => {
  it("shows bytes without a decimal place", () => {
    expect(formatBytes(0, { locale: "en-US" })).toBe("0 B");
    expect(formatBytes(480, { locale: "en-US" })).toBe("480 B");
  });

  it("switches unit at 1000 and rounds to one decimal", () => {
    expect(formatBytes(1000, { locale: "en-US" })).toBe("1.0 kB");
    expect(formatBytes(1234, { locale: "de-DE" })).toBe("1,2 kB");
    expect(formatBytes(12_500_000, { locale: "de-DE" })).toBe("12,5 MB");
    expect(formatBytes(3.2e9, { locale: "en-US" })).toBe("3.2 GB");
  });

  it("stays at the largest unit", () => {
    expect(formatBytes(5e15, { locale: "en-US" })).toBe("5,000.0 TB");
  });

  it("treats negative values as zero", () => {
    expect(formatBytes(-5, { locale: "en-US" })).toBe("0 B");
  });
});
