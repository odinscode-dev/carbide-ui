import type { ReactNode } from "react";
import styles from "./ListReport.module.css";

export interface ListReportProps {
  /** The page's name, left in the title zone. */
  title: string;
  /** Beside the title: what the list currently shows (a count, a duration). */
  meta?: ReactNode | undefined;
  /** Right in the title zone: the page's actions. */
  actions?: ReactNode | undefined;
  /** The filter bar: the fields that decide what the content shows. */
  filters: ReactNode;
  /** The list itself; it gets the rest of the height and scrolls on its own. */
  children: ReactNode;
}

/**
 * The List Report floorplan (SAP Fiori) with the bands of the prime grid:
 * title zone 64px, filter bar 64px, content the rest. Needs a main area that
 * fills its height (AdminShell `mainLayout="fill"`).
 */
export function ListReport({ title, meta, actions, filters, children }: ListReportProps) {
  return (
    <div className={styles.root}>
      <header className={styles.titleZone}>
        <div className={styles.titles}>
          <h1 className={styles.title}>{title}</h1>
          {meta !== undefined && <div className={styles.meta}>{meta}</div>}
        </div>
        {actions !== undefined && <div className={styles.actions}>{actions}</div>}
      </header>
      <div className={styles.filterBar}>{filters}</div>
      <section className={styles.content}>{children}</section>
    </div>
  );
}
