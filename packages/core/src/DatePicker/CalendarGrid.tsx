import { DatePicker as Ark, useDatePickerContext } from "@ark-ui/react/date-picker";
import styles from "./CalendarGrid.module.css";

export function CalendarGrid() {
  const datePicker = useDatePickerContext();

  return (
    <div className={styles.root}>
      <Ark.ViewControl className={styles.viewControl}>
        <Ark.PrevTrigger className={styles.navButton}>
          <ChevronIcon direction="prev" />
        </Ark.PrevTrigger>
        <Ark.MonthSelect className={styles.select} />
        <Ark.YearSelect className={styles.select} />
        <Ark.NextTrigger className={styles.navButton}>
          <ChevronIcon direction="next" />
        </Ark.NextTrigger>
      </Ark.ViewControl>
      <Ark.Table className={styles.table}>
        <Ark.TableHead>
          <Ark.TableRow>
            {datePicker.weekDays.map((day) => (
              <Ark.TableHeader className={styles.weekday} key={day.long}>
                {day.short}
              </Ark.TableHeader>
            ))}
          </Ark.TableRow>
        </Ark.TableHead>
        <Ark.TableBody>
          {datePicker.weeks.map((week) => (
            <Ark.TableRow key={week[0]?.toString()}>
              {week.map((day) => (
                <Ark.TableCell className={styles.cell} key={day.toString()} value={day}>
                  <Ark.TableCellTrigger className={styles.cellTrigger}>
                    {day.day}
                  </Ark.TableCellTrigger>
                </Ark.TableCell>
              ))}
            </Ark.TableRow>
          ))}
        </Ark.TableBody>
      </Ark.Table>
    </div>
  );
}

function ChevronIcon({ direction }: { direction: "prev" | "next" }) {
  return (
    <svg aria-hidden="true" className={styles.glyph} fill="none" viewBox="0 0 16 16">
      <path
        d={direction === "prev" ? "M10 4L6 8l4 4" : "M6 4l4 4-4 4"}
        stroke="currentcolor"
        strokeLinecap="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}
