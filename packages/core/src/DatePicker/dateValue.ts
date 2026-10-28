import { type DateValue, parseDate } from "@ark-ui/react/date-picker";

const TIME_ZONE = Intl.DateTimeFormat().resolvedOptions().timeZone;

export function toDateValue(date: Date): DateValue {
  return parseDate(date);
}

export function toDateValues(dates: readonly Date[]): DateValue[] {
  return parseDate([...dates]);
}

export function toNativeDate(value: DateValue, timeZone: string = TIME_ZONE): Date {
  return value.toDate(timeZone);
}
