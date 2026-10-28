import type { HTMLAttributes, ReactNode } from "react";
import { useId } from "react";
import { t } from "../i18n/t.js";
import { joinClassNames } from "../joinClassNames/joinClassNames.js";
import styles from "./StructuredList.module.css";

export interface StructuredListColumn {
  key: string;
  header?: ReactNode | undefined;
}

export interface StructuredListRow {
  value: string;
  disabled?: boolean | undefined;
  cells: Record<string, ReactNode>;
}

export interface StructuredListProps extends Omit<HTMLAttributes<HTMLTableElement>, "children"> {
  columns: readonly StructuredListColumn[];
  rows: readonly StructuredListRow[];
  selectable?: boolean | undefined;
  value?: string | undefined;
  onValueChange?: ((value: string) => void) | undefined;
}

export function StructuredList({
  columns,
  rows,
  selectable = false,
  value,
  onValueChange,
  className,
  ...rest
}: StructuredListProps) {
  const name = useId();
  const hasHeaderRow = columns.some((column) => column.header !== undefined);

  return (
    <table
      {...rest}
      className={joinClassNames(styles.root, className)}
      data-selectable={selectable ? "" : undefined}
    >
      {hasHeaderRow && (
        <thead>
          <tr className={styles.headerRow}>
            {selectable && <th className={styles.selectCell} />}
            {columns.map((column) => (
              <th className={styles.headerCell} key={column.key} scope="col">
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
      )}
      <tbody>
        {rows.map((row) => {
          const cells = columns.map((column) => (
            <td className={styles.cell} key={column.key}>
              {row.cells[column.key]}
            </td>
          ));

          if (!selectable) {
            return (
              <tr className={styles.row} key={row.value}>
                {cells}
              </tr>
            );
          }

          return (
            <tr
              className={styles.row}
              data-disabled={row.disabled ? "" : undefined}
              data-state={value === row.value ? "checked" : "unchecked"}
              key={row.value}
            >
              <td className={styles.selectCell}>
                <input
                  aria-label={t("structuredList.selectRow")}
                  checked={value === row.value}
                  className={styles.radio}
                  disabled={row.disabled}
                  name={name}
                  onChange={() => onValueChange?.(row.value)}
                  type="radio"
                  value={row.value}
                />
              </td>
              {cells}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
