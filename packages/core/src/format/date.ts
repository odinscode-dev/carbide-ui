import { type LocaleOptions, resolveLocale } from "./locale.js";

export interface TimeFormatOptions extends LocaleOptions {
  seconds?: boolean;
}

const DATE_FIELDS: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
};

const TIME_FIELDS: Intl.DateTimeFormatOptions = {
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
};

const SECOND_FIELD: Intl.DateTimeFormatOptions = { second: "2-digit" };

export function formatDate(value: Date, options: LocaleOptions = {}): string {
  return new Intl.DateTimeFormat(resolveLocale(options.locale), DATE_FIELDS).format(value);
}

export function formatTime(value: Date, options: TimeFormatOptions = {}): string {
  const fields = { ...TIME_FIELDS, ...(options.seconds === true ? SECOND_FIELD : {}) };
  return new Intl.DateTimeFormat(resolveLocale(options.locale), fields).format(value);
}

export function formatDateTime(value: Date, options: TimeFormatOptions = {}): string {
  const fields = {
    ...DATE_FIELDS,
    ...TIME_FIELDS,
    ...(options.seconds === true ? SECOND_FIELD : {}),
  };
  return new Intl.DateTimeFormat(resolveLocale(options.locale), fields).format(value);
}
