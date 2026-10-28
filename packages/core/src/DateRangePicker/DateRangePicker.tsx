import { DatePicker as Ark } from "@ark-ui/react/date-picker";
import { Portal } from "@ark-ui/react/portal";
import { CalendarGrid } from "../DatePicker/CalendarGrid.js";
import { toDateValue, toDateValues, toNativeDate } from "../DatePicker/dateValue.js";
import { formatDate } from "../format/date.js";
import { resolveLocale } from "../format/locale.js";
import styles from "./DateRangePicker.module.css";

export interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

export interface DateRangePickerProps {
  label: string;
  value?: DateRange | undefined;
  onValueChange?: ((value: DateRange) => void) | undefined;
  min?: Date | undefined;
  max?: Date | undefined;
  invalid?: boolean | undefined;
  id?: string | undefined;
  /** Language of the fields, month names and weekdays, and the order typed dates are read in. Defaults to the browser's. */
  locale?: string | undefined;
  /** IANA zone that decides which day is "today". Defaults to the browser's. */
  timeZone?: string | undefined;
}

const DEFAULT_TIME_ZONE = Intl.DateTimeFormat().resolvedOptions().timeZone;

export function DateRangePicker({
  label,
  value,
  onValueChange,
  min,
  max,
  invalid = false,
  id,
  locale,
  timeZone = DEFAULT_TIME_ZONE,
}: DateRangePickerProps) {
  const language = resolveLocale(locale);
  const values: Date[] = [];
  if (value?.from !== undefined) {
    values.push(value.from);
  }
  if (value?.to !== undefined) {
    values.push(value.to);
  }

  return (
    <Ark.Root
      className={styles.root}
      data-invalid={invalid ? "" : undefined}
      format={(datum) => formatDate(toNativeDate(datum, timeZone), { locale: language })}
      ids={
        id === undefined ? undefined : { input: (index) => `${id}-${index === 0 ? "from" : "to"}` }
      }
      invalid={invalid}
      locale={language}
      max={max === undefined ? undefined : toDateValue(max)}
      min={min === undefined ? undefined : toDateValue(min)}
      onValueChange={(details) => {
        if (details.value.length === 1) {
          return;
        }
        const [from, to] = details.value.map((datum) => toNativeDate(datum, timeZone));
        onValueChange?.({ from, to });
      }}
      selectionMode="range"
      startOfWeek={1}
      timeZone={timeZone}
      value={toDateValues(values)}
    >
      <Ark.Label className={styles.label}>{label}</Ark.Label>
      <Ark.Control className={styles.control}>
        <Ark.Input className={styles.input} index={0} />
        <span aria-hidden="true" className={styles.separator}>
          –
        </span>
        <Ark.Input className={styles.input} index={1} />
        <Ark.Trigger className={styles.trigger}>
          <CalendarIcon />
        </Ark.Trigger>
      </Ark.Control>
      <Portal>
        <Ark.Positioner className={styles.positioner}>
          <Ark.Content className={styles.content}>
            <CalendarGrid />
          </Ark.Content>
        </Ark.Positioner>
      </Portal>
    </Ark.Root>
  );
}

function CalendarIcon() {
  return (
    <svg aria-hidden="true" className={styles.glyph} fill="none" viewBox="0 0 16 16">
      <rect height="11" rx="1" stroke="currentcolor" strokeWidth="1.5" width="13" x="1.5" y="3" />
      <path d="M1.5 6.5h13M4.5 1.5v2M11.5 1.5v2" stroke="currentcolor" strokeWidth="1.5" />
    </svg>
  );
}
