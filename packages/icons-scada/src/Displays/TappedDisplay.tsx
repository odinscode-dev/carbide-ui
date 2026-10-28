import { Pipe, StatePoint, SymbolSvg } from "../symbol/Symbol.js";
import styles from "../symbol/Symbol.module.css";
import type { DisplayState } from "../symbol/states.js";

export interface DisplayProps {
  state?: DisplayState | undefined;
}

/** A gauge on a tap above a through pipe (W-E): pressure, level, pH, EC. */
export function TappedDisplay({
  label,
  letter,
  fontSize,
  state,
}: {
  label: string;
  letter: string;
  fontSize: number;
  state: DisplayState;
}) {
  return (
    <SymbolSvg label={label} state={state}>
      <path className={styles.detail} d="M48,38 V48" />
      <Pipe d="M0,48 H96" />
      <circle className={styles.body} cx="48" cy="22" r="16" />
      <text className={styles.label} fontSize={fontSize} textAnchor="middle" x="48" y="27">
        {letter}
      </text>
      <StatePoint />
    </SymbolSvg>
  );
}
