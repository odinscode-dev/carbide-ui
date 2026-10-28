import { Pipe, StatePoint, SymbolSvg } from "../symbol/Symbol.js";
import styles from "../symbol/Symbol.module.css";
import type { DisplayProps } from "./TappedDisplay.js";

export type FlowDisplayProps = DisplayProps;

/** Flow meter in the line: the pipe runs into and out of the circle (W-E). */
export function FlowDisplay({ state = "ok" }: FlowDisplayProps) {
  return (
    <SymbolSvg label="Flow display" state={state}>
      <Pipe d="M0,48 H32" />
      <Pipe d="M64,48 H96" />
      <circle className={styles.body} cx="48" cy="48" r="16" />
      <text className={styles.label} fontSize="14" textAnchor="middle" x="48" y="53">
        F
      </text>
      <StatePoint />
    </SymbolSvg>
  );
}
