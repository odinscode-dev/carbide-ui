import { type TabItem, Tabs } from "@odinscode/carbide-core";
import type { ReactNode } from "react";
import styles from "./ObjectPage.module.css";

export interface ObjectPageFact {
  /** A stable key; the label may change with the language. */
  id: string;
  label: string;
  value: ReactNode;
  /** The full value when the shown one is cut short (a long list of names). */
  title?: string | undefined;
}

export interface ObjectPageProps {
  /** Above the title: the way back to where the object was opened from. */
  breadcrumb?: ReactNode | undefined;
  /** The object's name, or the field to rename it while it is being edited. */
  title: ReactNode;
  /** Beside the title: the object's state as tags. */
  status?: ReactNode | undefined;
  /** Right in the title zone: what can be done with the object. */
  actions?: ReactNode | undefined;
  /** The header: the object's key facts, label above value. */
  facts: readonly ObjectPageFact[];
  tabs: TabItem[];
  tab: string;
  onTabChange: (tab: string) => void;
}

/**
 * The Object Page floorplan (SAP Fiori) with the bands of the prime grid:
 * title zone 64px, header 72px, tab bar 48px, content the rest, scrolling
 * under the tab bar on its own. Needs a main area that fills its height
 * (AdminShell `mainLayout="fill"`).
 */
export function ObjectPage({
  breadcrumb,
  title,
  status,
  actions,
  facts,
  tabs,
  tab,
  onTabChange,
}: ObjectPageProps) {
  return (
    <div className={styles.root}>
      <header className={styles.titleZone}>
        <div className={styles.titles}>
          {breadcrumb !== undefined && <div className={styles.breadcrumb}>{breadcrumb}</div>}
          <div className={styles.titleLine}>
            <h1 className={styles.title}>{title}</h1>
            {status !== undefined && <div className={styles.status}>{status}</div>}
          </div>
        </div>
        {actions !== undefined && <div className={styles.actions}>{actions}</div>}
      </header>
      <dl className={styles.header}>
        {facts.map((fact) => (
          <div key={fact.id} className={styles.fact}>
            <dt className={styles.factLabel}>{fact.label}</dt>
            <dd className={styles.factValue} title={fact.title}>
              {fact.value}
            </dd>
          </div>
        ))}
      </dl>
      <section className={styles.content}>
        <Tabs items={tabs} value={tab} onValueChange={onTabChange} layout="fill" />
      </section>
    </div>
  );
}
