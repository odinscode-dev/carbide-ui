import { describe, expect, it } from "vitest";
import { DAY_MS, dayTicks, formatDayLabel, formatDayTick, formatMomentTick } from "./resolution.js";

const SEPTEMBER_29 = Date.UTC(2026, 8, 29);

describe("formatDayTick", () => {
  it("shows day and month, no time", () => {
    expect(formatDayTick(SEPTEMBER_29, "de-DE")).toBe("29.09.");
    expect(formatDayTick(SEPTEMBER_29, "en-GB")).toBe("29/09");
  });
});

describe("formatDayLabel", () => {
  it("shows the full date, no time", () => {
    expect(formatDayLabel(SEPTEMBER_29, "de-DE")).toBe("29.09.2026");
  });

  it("reads the day as UTC, whatever the time zone of the machine", () => {
    // 2026-09-29T00:00Z is still the 28th in New York local time.
    expect(formatDayLabel(SEPTEMBER_29, "en-GB")).toBe("29/09/2026");
  });
});

describe("dayTicks", () => {
  it("takes the `at` of every row, in order", () => {
    const rows = [
      { at: 1, n: 3 },
      { at: 2, n: 4 },
      { at: 3, n: 5 },
    ];
    expect(dayTicks(rows)).toEqual([1, 2, 3]);
  });

  it("skips rows without a numeric `at`", () => {
    expect(dayTicks([{ at: 1 }, { at: "x" }, null, { n: 2 }, { at: Number.NaN }])).toEqual([1]);
  });

  it("reads another key when asked", () => {
    expect(dayTicks([{ day: 5 }], "day")).toEqual([5]);
  });
});

describe("formatMomentTick", () => {
  const at = Date.UTC(2026, 8, 5, 14, 30);

  it("shows only the time of day within a day", () => {
    expect(formatMomentTick(at, DAY_MS, { locale: "de-DE" })).toMatch(/^\d{2}:\d{2}$/);
  });

  it("puts the date in front over a longer stretch", () => {
    const label = formatMomentTick(at, 2 * DAY_MS, { locale: "de-DE" });
    expect(label).toMatch(/^\d{2}\.\d{2}\.,? \d{2}:\d{2}$/);
  });

  it("follows the locale's order of day and month", () => {
    expect(formatMomentTick(at, 2 * DAY_MS, { locale: "en-US" })).toMatch(
      /^\d{2}\/\d{2},? \d{2}:\d{2}$/,
    );
  });
});
