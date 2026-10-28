import { describe, expect, it } from "vitest";
import type { SeriesSlot } from "./series.js";
import { colorOf, lineLook, seriesColor } from "./series.js";
import type { ChartSeries } from "./types.js";

describe("seriesColor", () => {
  it("maps each slot to its own token, in fixed order", () => {
    const slots: SeriesSlot[] = [1, 2, 3, 4, 5, 6];
    expect(slots.map((slot) => seriesColor(slot))).toEqual([
      "var(--carbide-chart-series-1)",
      "var(--carbide-chart-series-2)",
      "var(--carbide-chart-series-3)",
      "var(--carbide-chart-series-4)",
      "var(--carbide-chart-series-5)",
      "var(--carbide-chart-series-6)",
    ]);
  });

  it("a seventh series is a compile-time error, not a slot", () => {
    // @ts-expect-error
    seriesColor(7);
  });
});

describe("colorOf", () => {
  const base: ChartSeries<{ at: number }> = { id: "a", name: "A", slot: 2 };

  it("is the slot's token without an own colour", () => {
    expect(colorOf(base)).toBe("var(--carbide-chart-series-2)");
  });

  it("an own colour wins over the slot", () => {
    expect(colorOf({ ...base, color: "var(--my-tone)" })).toBe("var(--my-tone)");
  });
});

describe("lineLook", () => {
  const base: ChartSeries<{ at: number }> = { id: "a", name: "A", slot: 1 };

  it("a plain series is only its colour", () => {
    expect(lineLook(base)).toEqual({ stroke: "var(--carbide-chart-series-1)" });
  });

  it("dashed adds a dash pattern", () => {
    expect(lineLook({ ...base, dashed: true }).strokeDasharray).toBeDefined();
  });

  it("strong is thicker, muted is faded, and neither touches the other", () => {
    const strong = lineLook({ ...base, emphasis: "strong" });
    const muted = lineLook({ ...base, emphasis: "muted" });
    expect(strong.strokeWidth).toBeGreaterThan(1);
    expect(strong.strokeOpacity).toBeUndefined();
    expect(muted.strokeOpacity).toBeLessThan(1);
    expect(muted.strokeWidth).toBeUndefined();
  });
});
