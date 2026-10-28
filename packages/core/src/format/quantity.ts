import type { LocaleOptions } from "./locale.js";
import { formatNumber } from "./number.js";
import { QUANTITIES, type Unit } from "./quantities.js";

const NBSP = "\u00a0";

export function formatQuantity(value: number, unit: Unit, options: LocaleOptions = {}): string {
  const { fractionDigits } = QUANTITIES[unit];
  return `${formatNumber(value, { ...options, fractionDigits })}${NBSP}${unit}`;
}
