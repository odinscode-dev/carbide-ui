import { Pipe, StatePoint, SymbolSvg } from "../symbol/Symbol.js";
import styles from "../symbol/Symbol.module.css";
import type { ReliefValveState } from "../symbol/states.js";

export interface ReliefValveProps {
  state?: ReliefValveState | undefined;
}

/** Relief valve as an angle valve: inlet S (from the vessel), outlet E, spring on top. */
export function ReliefValve({ state = "ok" }: ReliefValveProps) {
  return (
    <SymbolSvg label="Relief valve" state={state}>
      <Pipe d="M48,66 V96" />
      <Pipe d="M66,48 H96" />
      <path className={styles.detail} d="M48,48 V36" />
      <path className={styles.body} d="M38,66 H58 L48,48 Z" />
      <path className={styles.body} d="M66,38 V58 L48,48 Z" />
      <path className={styles.detail} d="M48,36 L42,33 L54,29 L42,25 L54,21 L42,17 L48,14" />
      <path className={styles.detail} d="M42,14 H54" />
      <StatePoint />
    </SymbolSvg>
  );
}
