import type { LocaleOptions } from "./locale.js";
import { formatNumber } from "./number.js";

const NBSP = " ";

const UNITS = ["B", "kB", "MB", "GB", "TB"] as const;
const BASE = 1000;

export function formatBytes(value: number, options: LocaleOptions = {}): string {
  let amount = Math.max(0, value);
  let unitIndex = 0;
  while (amount >= BASE && unitIndex < UNITS.length - 1) {
    amount /= BASE;
    unitIndex += 1;
  }
  const unit = UNITS[unitIndex] ?? "B";
  const fractionDigits = unitIndex === 0 ? 0 : 1;
  return `${formatNumber(amount, { ...options, fractionDigits })}${NBSP}${unit}`;
}
