import { describe, expect, it } from "vitest";
import { formatDate, formatDateTime, formatTime } from "./date.js";

const TIMESTAMP = new Date(2026, 8, 9, 14, 5, 30);
const MIDNIGHT = new Date(2026, 8, 9, 0, 0, 0);

describe("formatDate", () => {
  it("stays numeric and orders the fields by locale", () => {
    expect(formatDate(TIMESTAMP, { locale: "de-DE" })).toBe("09.09.2026");
    expect(formatDate(TIMESTAMP, { locale: "en-US" })).toBe("09/09/2026");
  });
});

describe("formatTime", () => {
  it("forces 24 hours in both locales", () => {
    expect(formatTime(TIMESTAMP, { locale: "de-DE" })).toBe("14:05");
    expect(formatTime(TIMESTAMP, { locale: "en-US" })).toBe("14:05");
  });

  it("shows midnight as 00:00, not as 24:00", () => {
    expect(formatTime(MIDNIGHT, { locale: "en-US" })).toBe("00:00");
  });

  it("shows seconds only on request", () => {
    expect(formatTime(TIMESTAMP, { locale: "de-DE", seconds: true })).toBe("14:05:30");
    expect(formatTime(TIMESTAMP, { locale: "de-DE", seconds: false })).toBe("14:05");
  });
});

describe("formatDateTime", () => {
  it("combines date and 24-hour time", () => {
    expect(formatDateTime(TIMESTAMP, { locale: "de-DE" })).toBe("09.09.2026, 14:05");
    expect(formatDateTime(TIMESTAMP, { locale: "en-US" })).toBe("09/09/2026, 14:05");
  });

  it("includes seconds", () => {
    expect(formatDateTime(TIMESTAMP, { locale: "de-DE", seconds: true })).toBe(
      "09.09.2026, 14:05:30",
    );
  });
});
