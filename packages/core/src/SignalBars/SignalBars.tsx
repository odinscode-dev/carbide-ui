import type { HTMLAttributes } from "react";
import { t } from "../i18n/t.js";
import { joinClassNames } from "../joinClassNames/joinClassNames.js";
import styles from "./SignalBars.module.css";

export interface SignalBarsProps extends Omit<HTMLAttributes<HTMLSpanElement>, "children"> {
  /** Received signal strength in dBm; null when there is none. */
  dbm: number | null;
  /**
   * The dBm from which two, three and four bars light, rising. One bar
   * lights for any signal below the first. Default: -75, -65, -55 (Wi-Fi).
   */
  levels?: readonly [number, number, number] | undefined;
}

const WIFI: readonly [number, number, number] = [-75, -65, -55];

/** How many of the four bars a signal lights. */
export function signalLevel(dbm: number | null, levels: readonly number[] = WIFI): number {
  if (dbm === null) {
    return 0;
  }
  return 1 + levels.filter((level) => dbm >= level).length;
}

/** Signal strength as four rising bars, like a phone's status bar. */
export function SignalBars({ dbm, levels = WIFI, className, ...rest }: SignalBarsProps) {
  const lit = signalLevel(dbm, levels);
  const label =
    dbm === null ? t("signalBars.none") : t("signalBars.label", { value: Math.round(dbm) });
  return (
    <span
      title={label}
      {...rest}
      aria-label={label}
      className={joinClassNames(styles.root, className)}
      data-level={lit}
      role="img"
    >
      {[1, 2, 3, 4].map((bar) => (
        <span className={styles.bar} data-lit={bar <= lit ? "" : undefined} key={bar} />
      ))}
    </span>
  );
}
