import { StatePoint, SymbolSvg } from "../symbol/Symbol.js";
import styles from "../symbol/Symbol.module.css";
import type { DisplayProps } from "./TappedDisplay.js";

export type CurrentDisplayProps = DisplayProps;

/** Current meter on an electrical conductor (dashed, no process port). */
export function CurrentDisplay({ state = "ok" }: CurrentDisplayProps) {
  return (
    <SymbolSvg label="Current display" state={state}>
      <path className={styles.detail} d="M48,38 V48" />
      <path className={styles.conductor} d="M0,48 H96" />
      <circle className={styles.body} cx="48" cy="22" r="16" />
      <text className={styles.label} fontSize="14" textAnchor="middle" x="48" y="27">
        I
      </text>
      <StatePoint />
    </SymbolSvg>
  );
}
