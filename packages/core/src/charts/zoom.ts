/** A stretch of the time axis, epoch ms: from, to. */
export type ChartDomain = readonly [number, number];

export interface ZoomLimits {
  /** The whole span of the data: what a chart shows unzoomed. */
  full: ChartDomain;
  /** The narrowest span a zoom may reach (ms). */
  minSpan: number;
}

const SPAN_TOLERANCE = 1e-9;

function spanOf(domain: ChartDomain): number {
  return domain[1] - domain[0];
}

function readAt(row: unknown, key: string): number | undefined {
  if (typeof row !== "object" || row === null) {
    return undefined;
  }
  const value: unknown = Reflect.get(row, key);
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

/** The span of the rows' x values, widened by `pad` on both ends; undefined without any. */
export function extentOf(rows: readonly unknown[], key = "at", pad = 0): ChartDomain | undefined {
  let min = Number.POSITIVE_INFINITY;
  let max = Number.NEGATIVE_INFINITY;
  for (const row of rows) {
    const at = readAt(row, key);
    if (at !== undefined) {
      min = Math.min(min, at);
      max = Math.max(max, at);
    }
  }
  return Number.isFinite(min) ? [min - pad, max + pad] : undefined;
}

/**
 * Brings a domain into the limits: at least the narrowest span, at most the
 * whole data span, and inside it. A span that had to change keeps its centre.
 */
export function clampDomain(domain: ChartDomain, limits: ZoomLimits): ChartDomain {
  const fullSpan = spanOf(limits.full);
  const span = Math.min(Math.max(spanOf(domain), Math.min(limits.minSpan, fullSpan)), fullSpan);
  const centred = domain[0] + (spanOf(domain) - span) / 2;
  const start = Math.min(Math.max(centred, limits.full[0]), limits.full[1] - span);
  return [start, start + span];
}

/** Whether the domain shows everything: nothing to reset. */
export function isFullDomain(domain: ChartDomain, limits: ZoomLimits): boolean {
  const tolerance = spanOf(limits.full) * SPAN_TOLERANCE;
  return domain[0] <= limits.full[0] + tolerance && domain[1] >= limits.full[1] - tolerance;
}

/** The x value a fraction (0 = left edge, 1 = right edge) across the domain stands for. */
export function valueAt(domain: ChartDomain, fraction: number): number {
  return domain[0] + Math.min(Math.max(fraction, 0), 1) * spanOf(domain);
}

/**
 * The domain scaled by `factor` (below 1 zooms in, above 1 out) so that the
 * value `anchor` stays where it is on the screen -- or moves to the fraction
 * `at` across the domain, as a pinch does when the fingers travel.
 */
export function zoomAround(
  domain: ChartDomain,
  limits: ZoomLimits,
  factor: number,
  anchor: number,
  at?: number,
): ChartDomain {
  const span = spanOf(domain);
  const relative = at ?? (span === 0 ? 0.5 : (anchor - domain[0]) / span);
  const scaled = span * factor;
  const start = anchor - relative * scaled;
  return clampDomain([start, start + scaled], limits);
}

/** The domain moved by `delta` (ms), stopping at the ends of the data. */
export function panBy(domain: ChartDomain, limits: ZoomLimits, delta: number): ChartDomain {
  return clampDomain([domain[0] + delta, domain[1] + delta], limits);
}

/** The domain a dragged selection between two x values stands for; undefined for an empty one. */
export function selectionDomain(a: number, b: number, limits: ZoomLimits): ChartDomain | undefined {
  const from = Math.min(a, b);
  const to = Math.max(a, b);
  return to > from ? clampDomain([from, to], limits) : undefined;
}

export interface VisibleRows<TRow> {
  /** The rows inside the domain: what the value axes fit themselves to. */
  inside: TRow[];
  /** Those plus the nearest row on either side, so a line still runs to the edge. */
  drawn: TRow[];
}

export function rowsInDomain<TRow>(
  rows: readonly TRow[],
  domain: ChartDomain,
  key = "at",
): VisibleRows<TRow> {
  let before: { at: number; row: TRow } | undefined;
  let after: { at: number; row: TRow } | undefined;
  const inside: TRow[] = [];
  for (const row of rows) {
    const at = readAt(row, key);
    if (at === undefined) {
      continue;
    }
    if (at < domain[0]) {
      if (before === undefined || at > before.at) {
        before = { at, row };
      }
    } else if (at > domain[1]) {
      if (after === undefined || at < after.at) {
        after = { at, row };
      }
    } else {
      inside.push(row);
    }
  }
  const neighbours = new Set<TRow>();
  if (before !== undefined) {
    neighbours.add(before.row);
  }
  if (after !== undefined) {
    neighbours.add(after.row);
  }
  const insideSet = new Set<TRow>(inside);
  return {
    inside,
    drawn: rows.filter((row) => insideSet.has(row) || neighbours.has(row)),
  };
}

export function ticksInDomain(ticks: readonly number[], domain: ChartDomain): number[] {
  return ticks.filter((tick) => tick >= domain[0] && tick <= domain[1]);
}
