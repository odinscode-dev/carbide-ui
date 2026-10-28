import { describe, expect, it } from "vitest";
import { axesFromSeries, axisDomain, axisTicks, dataKeyOf, drawKeyOf } from "./axes.js";
import type { ChartSeries } from "./types.js";

interface Measurement {
  at: number;
  pressure: number;
  flow: number;
  note: string;
}

describe("axesFromSeries", () => {
  it("without axisId all series share one axis, on the left, without a series color from the caller", () => {
    const series: ChartSeries<Measurement>[] = [
      { id: "a", name: "A", slot: 1, accessorKey: "pressure" },
      { id: "b", name: "B", slot: 2, accessorKey: "flow" },
    ];
    expect(axesFromSeries(series)).toEqual([
      {
        id: "value",
        orientation: "left",
        slot: 1,
        color: "var(--carbide-chart-series-1)",
        unit: undefined,
        unitLabel: undefined,
        hidden: false,
        title: true,
        padding: undefined,
        integers: false,
      },
    ]);
  });

  it("one axis per axisId, in order of first appearance, alternating left and right", () => {
    const series: ChartSeries<Measurement>[] = [
      {
        id: "a",
        name: "Pressure",
        slot: 1,
        accessorKey: "pressure",
        axisId: "pressure",
        unit: "bar",
      },
      {
        id: "b",
        name: "Flow",
        slot: 2,
        accessorKey: "flow",
        axisId: "flow",
        unit: "l/min",
      },
      { id: "c", name: "Pressure 2", slot: 3, accessorKey: "pressure", axisId: "pressure" },
    ];
    expect(axesFromSeries(series)).toEqual([
      {
        id: "pressure",
        orientation: "left",
        slot: 1,
        color: "var(--carbide-chart-series-1)",
        unit: "bar",
        unitLabel: undefined,
        hidden: false,
        title: true,
        padding: undefined,
        integers: false,
      },
      {
        id: "flow",
        orientation: "right",
        slot: 2,
        color: "var(--carbide-chart-series-2)",
        unit: "l/min",
        unitLabel: undefined,
        hidden: false,
        title: true,
        padding: undefined,
        integers: false,
      },
    ]);
  });

  it("axisHidden on the first series of an axisId hides that axis", () => {
    const series: ChartSeries<Measurement>[] = [
      {
        id: "a",
        name: "Pressure",
        slot: 1,
        accessorKey: "pressure",
        axisId: "pressure",
        axisHidden: true,
      },
      { id: "b", name: "Pressure 2", slot: 2, accessorKey: "pressure", axisId: "pressure" },
    ];
    expect(axesFromSeries(series)).toEqual([
      {
        id: "pressure",
        orientation: "left",
        slot: 1,
        color: "var(--carbide-chart-series-1)",
        unit: undefined,
        unitLabel: undefined,
        hidden: true,
        title: true,
        padding: undefined,
        integers: false,
      },
    ]);
  });
});

describe("axisTitle", () => {
  it("false on the first series of an axisId drops only the title", () => {
    const series: ChartSeries<Measurement>[] = [
      { id: "a", name: "P", slot: 1, accessorKey: "pressure", unit: "bar", axisTitle: false },
    ];
    const [axis] = axesFromSeries(series);
    expect([axis?.title, axis?.hidden]).toEqual([false, false]);
  });
});

describe("axisDomain", () => {
  const data: Measurement[] = [
    { at: 1, pressure: 2.0, flow: 10, note: "" },
    { at: 2, pressure: 2.4, flow: 14, note: "" },
    { at: 3, pressure: 2.2, flow: 12, note: "" },
  ];

  it("without axisPadding the axis is rounded outward to round steps", () => {
    const series: ChartSeries<Measurement>[] = [
      { id: "a", name: "A", slot: 1, accessorKey: "pressure" },
    ];
    const [axis] = axesFromSeries(series);
    if (axis === undefined) throw new Error("no axis");
    expect(axisDomain(axis, series, data)).toEqual([2, 2.4]);
  });

  it("fits min and max of every series on the axis plus the padding", () => {
    const series: ChartSeries<Measurement>[] = [
      { id: "a", name: "A", slot: 1, accessorKey: "pressure", axisId: "p", axisPadding: 0.05 },
      { id: "b", name: "B", slot: 2, accessorFn: (row) => row.pressure + 1, axisId: "p" },
      { id: "c", name: "C", slot: 3, accessorKey: "flow", axisId: "f", axisPadding: 0.5 },
    ];
    const [pressure, flow] = axesFromSeries(series);
    if (pressure === undefined || flow === undefined) throw new Error("no axis");
    // 2.0 .. 3.4 across both series, 5 % of 1.4 either side
    const [low, high] = axisDomain(pressure, series, data);
    expect(low).toBeCloseTo(1.93);
    expect(high).toBeCloseTo(3.47);
    expect(axisDomain(flow, series, data)).toEqual([8, 16]);
  });

  it("a flat series still gets height from the padding", () => {
    const flat = data.map((row) => ({ ...row, flow: 12 }));
    const series: ChartSeries<Measurement>[] = [
      { id: "c", name: "C", slot: 1, accessorKey: "flow", axisPadding: 0.5 },
    ];
    const [axis] = axesFromSeries(series);
    if (axis === undefined) throw new Error("no axis");
    expect(axisDomain(axis, series, flat)).toEqual([6, 18]);
  });

  it("no numeric data at all falls back to recharts", () => {
    const series: ChartSeries<Measurement>[] = [
      { id: "n", name: "N", slot: 1, accessorKey: "note", axisPadding: 0.05 },
    ];
    const [axis] = axesFromSeries(series);
    if (axis === undefined) throw new Error("no axis");
    expect(axisDomain(axis, series, data)).toEqual(["auto", "auto"]);
  });

  it("from zero: the floor is zero and only the top gets air", () => {
    const series: ChartSeries<Measurement>[] = [
      { id: "c", name: "C", slot: 1, accessorKey: "flow", axisPadding: 0.5 },
    ];
    const [axis] = axesFromSeries(series);
    if (axis === undefined) throw new Error("no axis");
    // 10 .. 14 fitted would start at 8; from zero it is 0 .. 14 + 50 % of 14
    expect(axisDomain(axis, series, data, true)).toEqual([0, 21]);
  });

  it("from zero without padding leaves the top to recharts", () => {
    const series: ChartSeries<Measurement>[] = [
      { id: "c", name: "C", slot: 1, accessorKey: "flow" },
    ];
    const [axis] = axesFromSeries(series);
    if (axis === undefined) throw new Error("no axis");
    expect(axisDomain(axis, series, data, true)).toEqual([0, "auto"]);
  });

  it("from zero keeps a negative floor", () => {
    const below = data.map((row) => ({ ...row, flow: row.flow - 12 }));
    const series: ChartSeries<Measurement>[] = [
      { id: "c", name: "C", slot: 1, accessorKey: "flow", axisPadding: 0.5 },
    ];
    const [axis] = axesFromSeries(series);
    if (axis === undefined) throw new Error("no axis");
    // -2 .. 2, 50 % of the 4 span either side
    expect(axisDomain(axis, series, below, true)).toEqual([-4, 4]);
  });
});

describe("dataKeyOf", () => {
  const row: Measurement = { at: 1000, pressure: 2.4, flow: 12, note: "ok" };

  it("reads accessorKey and passes numbers through", () => {
    const series: ChartSeries<Measurement> = {
      id: "pressure",
      name: "Pressure",
      slot: 1,
      accessorKey: "pressure",
    };
    expect(dataKeyOf(series)(row)).toBe(2.4);
  });

  it("non-numeric fields yield null, not a crash", () => {
    const series: ChartSeries<Measurement> = {
      id: "note",
      name: "Note",
      slot: 1,
      accessorKey: "note",
    };
    expect(dataKeyOf(series)(row)).toBeNull();
  });

  it("accessorFn takes priority over accessorKey", () => {
    const series: ChartSeries<Measurement> = {
      id: "sum",
      name: "Sum",
      slot: 1,
      accessorKey: "pressure",
      accessorFn: (row) => row.pressure + row.flow,
    };
    expect(dataKeyOf(series)(row)).toBe(14.4);
  });

  it("without accessorKey and accessorFn the value is null", () => {
    const series: ChartSeries<Measurement> = { id: "empty", name: "Empty", slot: 1 };
    expect(dataKeyOf(series)(row)).toBeNull();
  });
});

describe("axesFromSeries, integers", () => {
  it("axisIntegers of the first series on an axis makes the axis whole-number only", () => {
    const series: ChartSeries<Measurement>[] = [
      { id: "a", name: "A", slot: 1, accessorKey: "pressure", axisIntegers: true },
      { id: "b", name: "B", slot: 2, accessorKey: "flow" },
    ];
    expect(axesFromSeries(series)[0]?.integers).toBe(true);
  });
});

describe("axesFromSeries, colour and side", () => {
  it("the axis takes the colour of the series that introduces it", () => {
    const series: ChartSeries<Measurement>[] = [
      { id: "a", name: "A", slot: 1, accessorKey: "pressure", color: "#db0000", axisId: "one" },
      { id: "b", name: "B", slot: 2, accessorKey: "flow", color: "#006ce0", axisId: "one" },
    ];
    expect(axesFromSeries(series)[0]?.color).toBe("#db0000");
  });

  it("axisSide places an axis regardless of the alternation", () => {
    const series: ChartSeries<Measurement>[] = [
      { id: "a", name: "A", slot: 1, accessorKey: "pressure", axisId: "a", axisSide: "left" },
      { id: "b", name: "B", slot: 2, accessorKey: "flow", axisId: "b", axisSide: "right" },
      { id: "c", name: "C", slot: 3, accessorKey: "flow", axisId: "c", axisSide: "right" },
    ];
    expect(axesFromSeries(series).map((axis) => axis.orientation)).toEqual([
      "left",
      "right",
      "right",
    ]);
  });

  it("unitLabel of the introducing series labels the axis", () => {
    const series: ChartSeries<Measurement>[] = [
      { id: "a", name: "A", slot: 1, accessorKey: "pressure", unitLabel: "kPa" },
    ];
    expect(axesFromSeries(series)[0]?.unitLabel).toBe("kPa");
  });
});

describe("axisDomain, bands", () => {
  const data: Measurement[] = [
    { at: 1, pressure: 2.0, flow: 10, note: "" },
    { at: 2, pressure: 2.4, flow: 14, note: "" },
  ];
  const band = { id: "target", from: 1.5, to: 3, axisId: "value" };

  it("a band beyond the data widens a fitted axis", () => {
    const series: ChartSeries<Measurement>[] = [
      { id: "a", name: "A", slot: 1, accessorKey: "pressure", axisPadding: 0 },
    ];
    const [axis] = axesFromSeries(series);
    if (axis === undefined) throw new Error("no axis");
    expect(axisDomain(axis, series, data, false, [band])).toEqual([1.5, 3]);
  });

  it("a band on another axis changes nothing", () => {
    const series: ChartSeries<Measurement>[] = [
      { id: "a", name: "A", slot: 1, accessorKey: "pressure", axisPadding: 0 },
    ];
    const [axis] = axesFromSeries(series);
    if (axis === undefined) throw new Error("no axis");
    expect(axisDomain(axis, series, data, false, [{ ...band, axisId: "elsewhere" }])).toEqual([
      2.0, 2.4,
    ]);
  });

  it("without padding the axis is rounded outward to a round step around data and band", () => {
    const series: ChartSeries<Measurement>[] = [
      { id: "a", name: "A", slot: 1, accessorKey: "pressure" },
    ];
    const [axis] = axesFromSeries(series);
    if (axis === undefined) throw new Error("no axis");
    // data 2.0-2.4, band 1.5-3: span 1.5, five ticks, step 0.5
    expect(axisDomain(axis, series, data, false, [band])).toEqual([1.5, 3]);
    expect(axisDomain(axis, series, data, false, [{ ...band, from: 1.3, to: 3.1 }])).toEqual([
      1, 3.5,
    ]);
  });

  it("a band alone, without data, still gives a domain", () => {
    const series: ChartSeries<Measurement>[] = [
      { id: "a", name: "A", slot: 1, accessorKey: "note" },
    ];
    const [axis] = axesFromSeries(series);
    if (axis === undefined) throw new Error("no axis");
    expect(axisDomain(axis, series, [], false, [band])).toEqual([1.5, 3]);
  });

  it("from zero the rounded floor never rises above zero", () => {
    const series: ChartSeries<Measurement>[] = [
      { id: "a", name: "A", slot: 1, accessorKey: "pressure" },
    ];
    const [axis] = axesFromSeries(series);
    if (axis === undefined) throw new Error("no axis");
    expect(axisDomain(axis, series, data, true, [band])[0]).toBe(0);
  });

  it("lists round ticks for the rounded axis, and none where there is nothing to round", () => {
    const series: ChartSeries<Measurement>[] = [
      { id: "a", name: "A", slot: 1, accessorKey: "pressure" },
    ];
    const [axis] = axesFromSeries(series);
    if (axis === undefined) throw new Error("no axis");
    expect(axisTicks(axis, series, data, false, [band])).toEqual([1.5, 2, 2.5, 3]);
    expect(axisTicks(axis, series, data)).toEqual([2, 2.1, 2.2, 2.3, 2.4]);
    expect(axisTicks(axis, series, [])).toBeUndefined();
  });

  it("with padding the ticks sit on round steps inside the padded domain", () => {
    const series: ChartSeries<Measurement>[] = [
      { id: "a", name: "A", slot: 1, accessorKey: "pressure", axisPadding: 0.1 },
    ];
    const [axis] = axesFromSeries(series);
    if (axis === undefined) throw new Error("no axis");
    const domain = axisDomain(axis, series, data);
    const ticks = axisTicks(axis, series, data);
    if (ticks === undefined || typeof domain[0] !== "number" || typeof domain[1] !== "number") {
      throw new Error("expected numeric domain and ticks");
    }
    // data 2.0-2.4, padding 0.04: domain 1.96-2.44, step 0.1
    expect(ticks).toEqual([2, 2.1, 2.2, 2.3, 2.4]);
    for (const tick of ticks) {
      expect(tick).toBeGreaterThanOrEqual(domain[0]);
      expect(tick).toBeLessThanOrEqual(domain[1]);
    }
  });
});

describe("range series", () => {
  interface DayRange {
    at: number;
    low: number;
    high: number;
  }
  const days: DayRange[] = [
    { at: 0, low: 18, high: 26 },
    { at: 1, low: 19, high: 27 },
  ];

  it("fit the axis to both ends of every range", () => {
    const series: ChartSeries<DayRange>[] = [
      { id: "r", name: "R", slot: 1, rangeFn: (row) => [row.low, row.high], axisPadding: 0 },
    ];
    const [axis] = axesFromSeries(series);
    if (axis === undefined) throw new Error("no axis");
    expect(axisDomain(axis, series, days)).toEqual([18, 27]);
  });

  it("draw a pair per row, and nothing for a row without a range", () => {
    const entry: ChartSeries<DayRange> = {
      id: "r",
      name: "R",
      slot: 1,
      rangeFn: (row) => (row.at === 0 ? null : [row.low, row.high]),
    };
    const draw = drawKeyOf(entry);
    expect(draw({ at: 0, low: 1, high: 2 })).toBeNull();
    expect(draw({ at: 1, low: 1, high: 2 })).toEqual([1, 2]);
  });

  it("on a bar axis a range does not start at zero", () => {
    const series: ChartSeries<DayRange>[] = [
      { id: "r", name: "R", slot: 1, rangeFn: (row) => [row.low, row.high] },
    ];
    const [axis] = axesFromSeries(series);
    if (axis === undefined) throw new Error("no axis");
    expect(axisDomain(axis, series, days, true)).toEqual([18, 28]);
  });
});
