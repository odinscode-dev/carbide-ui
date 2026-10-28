import type { Unit } from "../format/quantities.js";
import { colorOf, type SeriesSlot } from "./series.js";
import type { ChartBand, ChartSeries } from "./types.js";

export const DEFAULT_AXIS_ID = "value";

export type ValueAxisOrientation = "left" | "right";

export interface ChartAxisSpec {
  id: string;
  orientation: ValueAxisOrientation;
  slot: SeriesSlot;
  /** What tints the axis: the introducing series' colour. */
  color: string;
  unit: Unit | undefined;
  unitLabel: string | undefined;
  hidden: boolean;
  /** Whether the unit stands beside the axis as its title. */
  title: boolean;
  padding: number | undefined;
  integers: boolean;
}

// Y domain for recharts: fixed numbers, its own auto scale, or zero up to
// whatever it picks.
export type AxisDomain = [number, number] | ["auto", "auto"] | [0, "auto"];

export function axesFromSeries<TRow>(series: ChartSeries<TRow>[]): ChartAxisSpec[] {
  const seen = new Map<string, ChartAxisSpec>();
  let index = 0;
  for (const entry of series) {
    const id = entry.axisId ?? DEFAULT_AXIS_ID;
    if (!seen.has(id)) {
      seen.set(id, {
        id,
        orientation: entry.axisSide ?? (index % 2 === 0 ? "left" : "right"),
        slot: entry.slot,
        color: colorOf(entry),
        unit: entry.unit,
        unitLabel: entry.unitLabel,
        hidden: entry.axisHidden ?? false,
        title: entry.axisTitle ?? true,
        padding: entry.axisPadding,
        integers: entry.axisIntegers ?? false,
      });
      index += 1;
    }
  }
  return [...seen.values()];
}

// The low and high end of a range series' row as recharts reads a ranged
// area or bar: a pair, or null for a row without a range.
export function rangeKeyOf<TRow>(
  entry: ChartSeries<TRow>,
): ((row: TRow) => [number, number] | null) | undefined {
  const read = entry.rangeFn;
  if (read === undefined) {
    return undefined;
  }
  return (row: TRow) => {
    const range = read(row);
    return range === null ? null : [range[0], range[1]];
  };
}

// What a series draws per row: its range where it has one, else its value.
export function drawKeyOf<TRow>(
  entry: ChartSeries<TRow>,
): (row: TRow) => number | [number, number] | null {
  return rangeKeyOf(entry) ?? dataKeyOf(entry);
}

export function dataKeyOf<TRow>(entry: ChartSeries<TRow>): (row: TRow) => number | null {
  if (entry.accessorFn !== undefined) {
    return entry.accessorFn;
  }
  const key = entry.accessorKey;
  return (row: TRow) => {
    if (key === undefined) {
      return null;
    }
    const value: unknown = row[key];
    return typeof value === "number" ? value : null;
  };
}

// The extent of every value the series on one axis take, or undefined when
// there is none.
function dataExtent<TRow>(
  axis: ChartAxisSpec,
  series: ChartSeries<TRow>[],
  data: TRow[],
): [number, number] | undefined {
  let min = Number.POSITIVE_INFINITY;
  let max = Number.NEGATIVE_INFINITY;
  for (const entry of series) {
    if ((entry.axisId ?? DEFAULT_AXIS_ID) !== axis.id) {
      continue;
    }
    const range = entry.rangeFn;
    const read = dataKeyOf(entry);
    for (const row of data) {
      const values = range === undefined ? [read(row)] : (range(row) ?? []);
      for (const value of values) {
        if (value !== null && Number.isFinite(value)) {
          min = Math.min(min, value);
          max = Math.max(max, value);
        }
      }
    }
  }
  return Number.isFinite(min) ? [min, max] : undefined;
}

const NICE_TICK_COUNT = 5;
const NICE_STEPS = [1, 2, 2.5, 5, 10];

// toPrecision drops the float noise of a product like 3 * 0.1.
function clean(value: number): number {
  return Number(value.toPrecision(12));
}

// Rounds an extent outward to multiples of a round step (1, 2, 2.5, 5 times a
// power of ten) and lists the ticks: recharts' own ticks on a fixed domain
// divide it evenly and land on the extent's digits, not on readable numbers.
function niceScale(min: number, max: number): { domain: [number, number]; ticks: number[] } {
  const span = max - min || Math.abs(max) || 1;
  const rough = span / NICE_TICK_COUNT;
  const magnitude = 10 ** Math.floor(Math.log10(rough));
  const step = (NICE_STEPS.find((factor) => factor * magnitude >= rough) ?? 10) * magnitude;
  const low = Math.floor(min / step);
  const high = Math.ceil(max / step);
  return {
    domain: [clean(low * step), clean(high * step)],
    ticks: Array.from({ length: high - low + 1 }, (_, index) => clean((low + index) * step)),
  };
}

// The domain of one axis: every series on it contributes its values, and
// the axis fits the span of them all plus the padding on either side. A
// flat series (all values equal) still needs some height, so it gets the
// padding as a fraction of the value itself -- or 1 when that is zero
// too. Without a padding the axis is left to recharts' default. Bars
// stand for a quantity, so a bar axis starts at zero whatever the data:
// a bar half as long is half as much, which a fitted axis would fake.
// A band on the axis must fit in whatever the data leaves: it can lie
// outside them (a target not yet reached), and recharts would cut it off.
// Data and bands together, on a round scale; from zero the floor never rises above zero.
function bandedScale(
  values: readonly number[],
  extent: [number, number] | undefined,
  fromZero: boolean,
): { domain: [number, number]; ticks: number[] } {
  const all = [...values, ...(extent ?? [])];
  return niceScale(fromZero ? Math.min(0, ...all) : Math.min(...all), Math.max(...all));
}

// An axis carrying only ranges never starts at zero for bars: a range is a
// stretch of values, not a quantity whose length means something.
function onlyRanges<TRow>(axis: ChartAxisSpec, series: ChartSeries<TRow>[]): boolean {
  const own = series.filter((entry) => (entry.axisId ?? DEFAULT_AXIS_ID) === axis.id);
  return own.length > 0 && own.every((entry) => entry.rangeFn !== undefined);
}

export function axisDomain<TRow>(
  axis: ChartAxisSpec,
  series: ChartSeries<TRow>[],
  data: TRow[],
  barsFromZero = false,
  bands: readonly ChartBand[] = [],
): AxisDomain {
  const fromZero = barsFromZero && !onlyRanges(axis, series);
  const values = bands
    .filter((band) => (band.axisId ?? DEFAULT_AXIS_ID) === axis.id)
    .flatMap((band) => [band.from, band.to]);
  const extent = dataExtent(axis, series, data);
  if (axis.padding === undefined) {
    if (values.length === 0 && (fromZero || extent === undefined)) {
      return fromZero ? [0, "auto"] : ["auto", "auto"];
    }
    return bandedScale(values, extent, fromZero).domain;
  }
  if (extent === undefined) {
    return ["auto", "auto"];
  }
  const min = Math.min(extent[0], ...values);
  const max = Math.max(extent[1], ...values);
  if (fromZero) {
    const floor = Math.min(0, min);
    const ceiling = Math.max(0, max);
    const air = (ceiling - floor || 1) * axis.padding;
    return [floor === 0 ? 0 : floor - air, ceiling === 0 ? 0 : ceiling + air];
  }
  const span = max - min;
  const base = span > 0 ? span : Math.abs(max) > 0 ? Math.abs(max) : 1;
  const air = base * axis.padding;
  return [min - air, max + air];
}

// Round ticks inside a fixed domain: the domain keeps its exact ends (data
// plus padding), the ticks sit on the round steps between them -- recharts
// would divide the domain evenly and label digits like 22.745655.
function ticksWithin(low: number, high: number): number[] {
  const { ticks } = niceScale(low, high);
  return ticks.filter((tick) => tick >= low - 1e-9 && tick <= high + 1e-9);
}

/**
 * The ticks for an axis: round steps for a rounded domain (`axisDomain`
 * without a padding) and round steps inside a padded one; undefined where
 * recharts ticks itself (no data, or a bar axis without bands).
 */
export function axisTicks<TRow>(
  axis: ChartAxisSpec,
  series: ChartSeries<TRow>[],
  data: TRow[],
  barsFromZero = false,
  bands: readonly ChartBand[] = [],
): number[] | undefined {
  const fromZero = barsFromZero && !onlyRanges(axis, series);
  if (axis.padding !== undefined) {
    const domain = axisDomain(axis, series, data, barsFromZero, bands);
    const [low, high] = domain;
    return typeof low === "number" && typeof high === "number" && high > low
      ? ticksWithin(low, high)
      : undefined;
  }
  const values = bands
    .filter((band) => (band.axisId ?? DEFAULT_AXIS_ID) === axis.id)
    .flatMap((band) => [band.from, band.to]);
  const extent = dataExtent(axis, series, data);
  if (values.length === 0 && (fromZero || extent === undefined)) {
    return undefined;
  }
  return bandedScale(values, extent, fromZero).ticks;
}
