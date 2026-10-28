import { formatTime } from "../format/date.js";
import { resolveLocale } from "../format/locale.js";

/**
 * What one x value of a chart stands for. "time" is a moment (ticks and tooltip
 * show date and time); "day" is a calendar day, carried as the epoch
 * milliseconds of that day's UTC midnight (ticks show the date, no time).
 */
export type ChartResolution = "time" | "day";

export const DAY_MS = 24 * 60 * 60_000;

// A day is a date, not a moment: it is read as UTC so that 2026-09-29 stays
// the 29th in every time zone instead of sliding to the 28th west of Greenwich.
const TICK_FIELDS: Intl.DateTimeFormatOptions = {
  day: "2-digit",
  month: "2-digit",
  timeZone: "UTC",
};
const LABEL_FIELDS: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  timeZone: "UTC",
};

export function formatDayTick(at: number, locale?: string): string {
  return new Intl.DateTimeFormat(resolveLocale(locale), TICK_FIELDS).format(new Date(at));
}

export function formatDayLabel(at: number, locale?: string): string {
  return new Intl.DateTimeFormat(resolveLocale(locale), LABEL_FIELDS).format(new Date(at));
}

// The x values of the rows, in order -- one tick per day, which the axis then
// thins to what fits. Rows without a numeric `at` are skipped.
export function dayTicks(rows: readonly unknown[], key = "at"): number[] {
  const ticks: number[] = [];
  for (const row of rows) {
    if (typeof row !== "object" || row === null) {
      continue;
    }
    const value: unknown = Reflect.get(row, key);
    if (typeof value === "number" && Number.isFinite(value)) {
      ticks.push(value);
    }
  }
  return ticks;
}

const MOMENT_TICK_FIELDS: Intl.DateTimeFormatOptions = {
  day: "2-digit",
  month: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
};

/**
 * The label of a tick on a time axis. Within a day the time of day says it
 * all; over a longer stretch the same time comes round again, so the date
 * goes in front.
 */
export function formatMomentTick(
  at: number,
  span: number,
  options: { locale?: string | undefined; seconds?: boolean | undefined } = {},
): string {
  const value = new Date(at);
  if (span <= DAY_MS) {
    return formatTime(value, {
      ...(options.seconds === undefined ? {} : { seconds: options.seconds }),
      ...(options.locale === undefined ? {} : { locale: options.locale }),
    });
  }
  return new Intl.DateTimeFormat(resolveLocale(options.locale), MOMENT_TICK_FIELDS).format(value);
}
