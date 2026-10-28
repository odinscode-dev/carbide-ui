import { t } from "@odinscode/carbide-core";
import type { ReactNode } from "react";
import styles from "./HomeChartTile.module.css";

export interface HomeChartTileProps {
  id: string;

  title: string;

  rotateHint?: string | undefined;

  children: ReactNode;
}

export function HomeChartTile({ id, title, rotateHint, children }: HomeChartTileProps) {
  return (
    <div className={styles.root} data-home-chart-tile-id={id}>
      <div className={styles.hint}>
        <span aria-hidden="true" className={styles.icon}>
          <RotateIcon />
        </span>
        <p className={styles.title}>{title}</p>
        <p className={styles.text}>{rotateHint ?? t("homeChartTile.rotateHint")}</p>
      </div>
      <div className={styles.chart}>{children}</div>
    </div>
  );
}

function RotateIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="32" viewBox="0 0 24 24" width="32">
      <rect height="15" rx="2" stroke="currentcolor" strokeWidth="1.5" width="9" x="3.5" y="4.5" />
      <path
        d="M16 8a5.5 5.5 0 1 1-1.6 6.7"
        stroke="currentcolor"
        strokeLinecap="round"
        strokeWidth="1.5"
      />
      <path
        d="M13 7.5 15.3 8.3 14.6 10.7"
        stroke="currentcolor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}
