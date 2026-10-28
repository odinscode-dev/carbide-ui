import type { ReactNode } from "react";
import styles from "./SymbolSheet.module.css";

export interface SheetCell {
  /** Under the symbol: the state or position it shows. */
  label: string;
  symbol: ReactNode;
}

export interface SheetRow {
  name: string;
  /** The plant tag (e.g. P-101); it sits next to the symbol, not in the SVG. */
  tag?: string | undefined;
  cells: readonly SheetCell[];
}

function Row({ row }: { row: SheetRow }) {
  return (
    <div
      className={styles.row}
      style={{ gridTemplateColumns: `10em repeat(${row.cells.length}, 1fr)` }}
    >
      <div className={styles.name}>
        {row.name}
        {row.tag !== undefined && <span className={styles.tag}>{row.tag}</span>}
      </div>
      {row.cells.map((cell) => (
        <div className={styles.cell} key={cell.label}>
          {cell.symbol}
          <span className={styles.cellName}>{cell.label}</span>
        </div>
      ))}
    </div>
  );
}

function Panel({ theme, rows }: { theme: "light" | "dark"; rows: readonly SheetRow[] }) {
  return (
    <section className={styles.theme} data-theme={theme}>
      <h2 className={styles.title}>data-theme=&quot;{theme}&quot;</h2>
      <div className={styles.panel}>
        {rows.map((row) => (
          <Row key={row.name} row={row} />
        ))}
      </div>
    </section>
  );
}

/** A story sheet for a symbol group: every row in both themes, side by side. */
export function SymbolSheet({ note, rows }: { note: string; rows: readonly SheetRow[] }) {
  return (
    <div className={styles.sheet}>
      <p className={styles.note}>{note}</p>
      <div className={styles.themes}>
        <Panel rows={rows} theme="light" />
        <Panel rows={rows} theme="dark" />
      </div>
    </div>
  );
}
