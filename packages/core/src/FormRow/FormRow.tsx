import { Children, type ReactNode } from "react";
import styles from "./FormRow.module.css";

export interface FormRowProps {
  children: ReactNode;

  spans?: readonly number[] | undefined;
}

const COLUMNS = 12;

export function FormRow({ children, spans }: FormRowProps) {
  const count = Children.count(children);
  const widths = spans ?? evenSplit(count);

  if (widths.length !== count) {
    throw new Error(`FormRow: ${widths.length} spans for ${count} fields.`);
  }
  const sum = widths.reduce((a, b) => a + b, 0);
  if (sum !== COLUMNS) {
    throw new Error(`FormRow: spans add up to ${sum} columns, not ${COLUMNS}.`);
  }
  const outOfRange = widths.find((width) => width < 1 || width > COLUMNS);
  if (outOfRange !== undefined) {
    throw new Error(`FormRow: span ${outOfRange} is outside 1..${COLUMNS}.`);
  }

  return (
    <div className={styles.root}>
      {Children.map(children, (field, index) => (
        <div className={styles.cell} data-span={widths[index]}>
          {field}
        </div>
      ))}
    </div>
  );
}

function evenSplit(count: number): number[] {
  if (count === 0) {
    return [];
  }
  const width = Math.floor(COLUMNS / count);
  const widths = Array.from({ length: count }, () => width);
  widths[count - 1] = COLUMNS - width * (count - 1);
  return widths;
}
