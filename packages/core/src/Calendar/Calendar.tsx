import { DatePicker as Ark } from "@ark-ui/react/date-picker";
import { CalendarGrid } from "../DatePicker/CalendarGrid.js";
import { toDateValues, toNativeDate } from "../DatePicker/dateValue.js";
import { resolveLocale } from "../format/locale.js";
import styles from "./Calendar.module.css";

export interface CalendarSingleProps {
  range?: false | undefined;
  value?: Date | undefined;
  onValueChange?: ((value: Date) => void) | undefined;
  isDateDisabled?: ((date: Date) => boolean) | undefined;
  id?: string | undefined;
  /** Month names and weekdays. Defaults to the browser's language. */
  locale?: string | undefined;
  /** IANA zone that decides which day is "today". Defaults to the browser's. */
  timeZone?: string | undefined;
}

export interface CalendarRangeProps {
  range: true;
  value?: readonly [Date, Date] | undefined;
  onValueChange?: ((value: [Date, Date]) => void) | undefined;
  isDateDisabled?: ((date: Date) => boolean) | undefined;
  id?: string | undefined;
  /** Month names and weekdays. Defaults to the browser's language. */
  locale?: string | undefined;
  /** IANA zone that decides which day is "today". Defaults to the browser's. */
  timeZone?: string | undefined;
}

const DEFAULT_TIME_ZONE = Intl.DateTimeFormat().resolvedOptions().timeZone;

export type CalendarProps = CalendarSingleProps | CalendarRangeProps;

function isRange(props: CalendarProps): props is CalendarRangeProps {
  return props.range === true;
}

export function Calendar(props: CalendarProps) {
  const { isDateDisabled, id, locale, timeZone = DEFAULT_TIME_ZONE } = props;
  const range = isRange(props);
  const values: Date[] = range
    ? props.value === undefined
      ? []
      : [...props.value]
    : props.value === undefined
      ? []
      : [props.value];

  return (
    <Ark.Root
      className={styles.root}
      ids={id === undefined ? undefined : { root: id }}
      inline
      locale={resolveLocale(locale)}
      isDateUnavailable={
        isDateDisabled === undefined
          ? undefined
          : (date) => isDateDisabled(toNativeDate(date, timeZone))
      }
      onValueChange={(details) => {
        const dates = details.value.map((datum) => toNativeDate(datum, timeZone));
        if (range) {
          const [from, to] = dates;
          if (from !== undefined && to !== undefined) {
            props.onValueChange?.([from, to]);
          }
        } else if (dates[0] !== undefined) {
          props.onValueChange?.(dates[0]);
        }
      }}
      selectionMode={range ? "range" : "single"}
      startOfWeek={1}
      timeZone={timeZone}
      value={toDateValues(values)}
    >
      <CalendarGrid />
    </Ark.Root>
  );
}
