import { formatDateTime } from "../format/date.js";
import { formatNumber } from "../format/number.js";
import type { Unit } from "../format/quantities.js";
import { formatQuantity } from "../format/quantity.js";
import { type ChartResolution, formatDayLabel } from "./resolution.js";

/**
 * How the tooltip writes one series' reading, by series name: a `format`
 * function wins over the digits `unit` gives, and `unitLabel` is appended to
 * either, since a custom format leaves the unit to the label.
 */
export interface TooltipValueStyle {
  unit?: Unit | undefined;
  unitLabel?: string | undefined;
  format?: ((value: number) => string) | undefined;
}

// A range as "low - high", each end in the series' own format.
export function formatTooltipRange(
  low: number,
  high: number,
  name: string,
  units: Readonly<Record<string, Unit>>,
  styles: Readonly<Record<string, TooltipValueStyle>> = {},
): string {
  return `${formatTooltipValue(low, name, units, styles)} – ${formatTooltipValue(high, name, units, styles)}`;
}

export function formatTooltipValue(
  value: number,
  name: string,
  units: Readonly<Record<string, Unit>>,
  styles: Readonly<Record<string, TooltipValueStyle>> = {},
): string {
  const style = styles[name] ?? { unit: units[name] };
  if (style.format !== undefined) {
    return withUnitLabel(style.format(value), style.unitLabel);
  }
  if (style.unitLabel !== undefined) {
    return withUnitLabel(formatNumber(value), style.unitLabel);
  }
  return style.unit === undefined ? formatNumber(value) : formatQuantity(value, style.unit);
}

function withUnitLabel(text: string, unitLabel: string | undefined): string {
  return unitLabel === undefined ? text : `${text} ${unitLabel}`;
}

export function formatTooltipLabel(
  at: number,
  resolution: ChartResolution = "time",
  locale?: string,
): string {
  return resolution === "day"
    ? formatDayLabel(at, locale)
    : formatDateTime(new Date(at), locale === undefined ? {} : { locale });
}
