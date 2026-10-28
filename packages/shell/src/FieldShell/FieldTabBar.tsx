import { t } from "@odinscode/carbide-core";
import type { ReactNode } from "react";
import styles from "./FieldTabBar.module.css";

export interface FieldTab {
  id: string;
  label: string;
  icon: ReactNode;
}

export interface FieldTabBarProps {
  tabs: readonly FieldTab[];

  active: string;
  onChange: (id: string) => void;

  label?: string | undefined;
}

export function FieldTabBar({ tabs, active, onChange, label }: FieldTabBarProps) {
  return (
    <nav aria-label={label ?? t("fieldTabBar.label")} className={styles.root}>
      <ul className={styles.list}>
        {tabs.map((tab) => (
          <li className={styles.item} key={tab.id}>
            <button
              aria-current={tab.id === active ? "page" : undefined}
              className={styles.tab}
              data-active={tab.id === active ? "" : undefined}
              onClick={() => onChange(tab.id)}
              type="button"
            >
              <span aria-hidden="true" className={styles.icon}>
                {tab.icon}
              </span>
              <span className={styles.label}>{tab.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
