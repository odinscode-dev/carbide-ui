import { type LocaleOptions, resolveLocale } from "./locale.js";

export interface NumberFormatOptions extends LocaleOptions {
  fractionDigits?: number;
}

export function formatNumber(value: number, options: NumberFormatOptions = {}): string {
  const { locale, fractionDigits } = options;
  const digitOptions: Intl.NumberFormatOptions =
    fractionDigits === undefined
      ? {}
      : { minimumFractionDigits: fractionDigits, maximumFractionDigits: fractionDigits };
  return new Intl.NumberFormat(resolveLocale(locale), digitOptions).format(value);
}

const WHITESPACE = /\s/g;

const MINUS = /\u2212/g;

const NUMBER_PATTERN = /^[+-]?(?:\d+(?:[.,]\d+)*|[.,]\d+)$/;

export function parseNumber(text: string): number | null {
  const compact = text.replaceAll(WHITESPACE, "").replaceAll(MINUS, "-");
  if (!NUMBER_PATTERN.test(compact)) {
    return null;
  }

  const lastSeparator = Math.max(compact.lastIndexOf("."), compact.lastIndexOf(","));
  const raw =
    lastSeparator === -1
      ? compact
      : `${compact.slice(0, lastSeparator).replaceAll(/[.,]/g, "")}.${compact.slice(lastSeparator + 1)}`;

  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : null;
}
