import { describe, expect, it } from "vitest";
import { sliceColor } from "./PieChart.js";
import { seriesColor } from "./series.js";

describe("sliceColor", () => {
  it("takes the slot's colour by default", () => {
    expect(sliceColor({ id: "a", name: "A", value: 1, slot: 2 })).toBe(seriesColor(2));
  });

  it("lets a free colour win over the slot", () => {
    expect(sliceColor({ id: "a", name: "A", value: 1, slot: 2, color: "var(--x)" })).toBe(
      "var(--x)",
    );
  });
});
