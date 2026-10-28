import { Pipe, SymbolSvg } from "../symbol/Symbol.js";
import styles from "../symbol/Symbol.module.css";

/** Check valve: flows W to E only. No drive, no state. */
export function CheckValve() {
  return (
    <SymbolSvg label="Check valve">
      <Pipe d="M0,48 H30" />
      <Pipe d="M60,48 H96" />
      <path className={styles.body} d="M30,38 V58 L60,48 Z" />
      <path className={styles.contour} d="M60,36 V60" />
    </SymbolSvg>
  );
}
