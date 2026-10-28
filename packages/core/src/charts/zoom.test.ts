import { describe, expect, it } from "vitest";
import {
  clampDomain,
  extentOf,
  isFullDomain,
  panBy,
  rowsInDomain,
  selectionDomain,
  ticksInDomain,
  valueAt,
  zoomAround,
} from "./zoom.js";

const LIMITS = { full: [0, 1000] as const, minSpan: 10 };

describe("extentOf", () => {
  it("spans the x values, widened by the pad, ignoring rows without one", () => {
    expect(extentOf([{ at: 5 }, { at: 9 }, { at: 2 }, { other: 1 }], "at", 1)).toEqual([1, 10]);
  });

  it("is undefined without a single x value", () => {
    expect(extentOf([{ other: 1 }])).toBeUndefined();
    expect(extentOf([])).toBeUndefined();
  });
});

describe("clampDomain", () => {
  it("leaves a domain inside the limits alone", () => {
    expect(clampDomain([100, 300], LIMITS)).toEqual([100, 300]);
  });

  it("shifts a domain that pokes out back inside, keeping its span", () => {
    expect(clampDomain([-50, 150], LIMITS)).toEqual([0, 200]);
    expect(clampDomain([900, 1100], LIMITS)).toEqual([800, 1000]);
  });

  it("widens a span below the narrowest around its centre", () => {
    expect(clampDomain([500, 502], LIMITS)).toEqual([496, 506]);
  });

  it("never exceeds the whole data span", () => {
    expect(clampDomain([-500, 1500], LIMITS)).toEqual([0, 1000]);
  });
});

describe("isFullDomain", () => {
  it("is true only for the whole span", () => {
    expect(isFullDomain([0, 1000], LIMITS)).toBe(true);
    expect(isFullDomain([0, 999], LIMITS)).toBe(false);
    expect(isFullDomain([1, 1000], LIMITS)).toBe(false);
  });
});

describe("valueAt", () => {
  it("maps a fraction across the domain to a value, clamped to the edges", () => {
    expect(valueAt([200, 400], 0.5)).toBe(300);
    expect(valueAt([200, 400], -1)).toBe(200);
    expect(valueAt([200, 400], 2)).toBe(400);
  });
});

describe("zoomAround", () => {
  it("halves the span around the anchor, which keeps its place", () => {
    const zoomed = zoomAround([0, 1000], LIMITS, 0.5, 250);
    expect(zoomed).toEqual([125, 625]);
    expect((250 - zoomed[0]) / (zoomed[1] - zoomed[0])).toBe(0.25);
  });

  it("zooms out to the whole span at most", () => {
    expect(zoomAround([400, 600], LIMITS, 100, 500)).toEqual([0, 1000]);
  });

  it("stops at the narrowest span", () => {
    const zoomed = zoomAround([400, 420], LIMITS, 0.01, 410);
    expect(zoomed[1] - zoomed[0]).toBe(10);
  });

  it("stays inside the data when the anchor is at an end", () => {
    expect(zoomAround([0, 1000], LIMITS, 0.5, 0)).toEqual([0, 500]);
    expect(zoomAround([0, 1000], LIMITS, 0.5, 1000)).toEqual([500, 1000]);
  });
});

describe("panBy", () => {
  it("moves the domain and stops at the ends of the data", () => {
    expect(panBy([100, 300], LIMITS, 50)).toEqual([150, 350]);
    expect(panBy([100, 300], LIMITS, -500)).toEqual([0, 200]);
    expect(panBy([700, 900], LIMITS, 500)).toEqual([800, 1000]);
  });
});

describe("selectionDomain", () => {
  it("orders the two ends", () => {
    expect(selectionDomain(300, 100, LIMITS)).toEqual([100, 300]);
  });

  it("is undefined for an empty selection", () => {
    expect(selectionDomain(200, 200, LIMITS)).toBeUndefined();
  });

  it("widens a selection narrower than the narrowest span", () => {
    expect(selectionDomain(500, 503, LIMITS)).toEqual([496.5, 506.5]);
  });
});

describe("rowsInDomain", () => {
  const rows = [{ at: 0 }, { at: 10 }, { at: 20 }, { at: 30 }, { at: 40 }, { at: 50 }];

  it("splits the rows into those inside and those drawn", () => {
    const { inside, drawn } = rowsInDomain(rows, [15, 35]);
    expect(inside.map((row) => row.at)).toEqual([20, 30]);
    expect(drawn.map((row) => row.at)).toEqual([10, 20, 30, 40]);
  });

  it("counts the edges as inside", () => {
    expect(rowsInDomain(rows, [10, 30]).inside.map((row) => row.at)).toEqual([10, 20, 30]);
  });

  it("draws the neighbours even when no row is inside", () => {
    const { inside, drawn } = rowsInDomain(rows, [21, 29]);
    expect(inside).toEqual([]);
    expect(drawn.map((row) => row.at)).toEqual([20, 30]);
  });

  it("does not depend on the rows being sorted", () => {
    const shuffled = [{ at: 30 }, { at: 0 }, { at: 40 }, { at: 10 }, { at: 20 }];
    expect(rowsInDomain(shuffled, [15, 35]).drawn.map((row) => row.at)).toEqual([30, 40, 10, 20]);
  });
});

describe("ticksInDomain", () => {
  it("keeps the ticks inside, edges included", () => {
    expect(ticksInDomain([0, 10, 20, 30], [10, 20])).toEqual([10, 20]);
  });
});
