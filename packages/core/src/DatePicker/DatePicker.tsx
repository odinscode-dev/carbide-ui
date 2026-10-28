import { DatePicker as Ark } from "@ark-ui/react/date-picker";
import { Portal } from "@ark-ui/react/portal";
import { formatDate } from "../format/date.js";
import { resolveLocale } from "../format/locale.js";
import { CalendarGrid } from "./CalendarGrid.js";
import styles from "./DatePicker.module.css";
import { toDateValue, toNativeDate } from "./dateValue.js";
import { localePlaceholder } from "./placeholderPattern.js";

const DEFAULT_TIME_ZONE = Intl.DateTimeFormat().resolvedOptions().timeZone;

export interface DatePickerProps {
  label: string;
  value?: Date | undefined;

  onValueChange?: ((value: Date | null) => void) | undefined;
  min?: Date | undefined;
  max?: Date | undefined;
  invalid?: boolean | undefined;
  disabled?: boolean | undefined;
  id?: string | undefined;
  /**
   * Language of field, month names and weekdays, and the order in which typed
   * dates are read ("de-DE": 05.10.2026 is the fifth of October). Defaults
   * to the browser's, like `formatDate`.
   */
  locale?: string | undefined;
  /**
   * Pattern shown in the empty field, in any letters ("TT.MM.JJJJ").
   * Display only: the order in which typed dates are read still follows
   * `locale`, so keep both in step. Defaults to the locale's pattern
   * (German: `TT.MM.JJJJ`; other languages: Ark's, e.g. `dd/mm/yyyy`).
   */
  placeholder?: string | undefined;
  /** IANA zone that decides which day is "today". Defaults to the browser's. */
  timeZone?: string | undefined;
}

export function DatePicker({
  label,
  value,
  onValueChange,
  min,
  max,
  invalid = false,
  disabled = false,
  id,
  locale,
  placeholder,
  timeZone = DEFAULT_TIME_ZONE,
}: DatePickerProps) {
  const language = resolveLocale(locale);
  return (
    <Ark.Root
      className={styles.root}
      data-invalid={invalid ? "" : undefined}
      disabled={disabled}
      format={(datum) => formatDate(toNativeDate(datum, timeZone), { locale: language })}
      ids={id === undefined ? undefined : { input: () => id }}
      invalid={invalid}
      locale={language}
      max={max === undefined ? undefined : toDateValue(max)}
      min={min === undefined ? undefined : toDateValue(min)}
      placeholder={placeholder ?? localePlaceholder(language)}
      onValueChange={(details) => {
        const [first] = details.value;
        onValueChange?.(first === undefined ? null : toNativeDate(first, timeZone));
      }}
      startOfWeek={1}
      timeZone={timeZone}
      value={value === undefined ? [] : [toDateValue(value)]}
    >
      <Ark.Label className={styles.label}>{label}</Ark.Label>
      <Ark.Control className={styles.control}>
        <Ark.Input className={styles.input} />
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
