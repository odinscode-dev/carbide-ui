import { Pipe, SymbolSvg } from "../symbol/Symbol.js";
import styles from "../symbol/Symbol.module.css";

const SHELL = "M40,34 H56 A14,14 0 0 1 56,62 H40 A14,14 0 0 1 40,34 Z";

/**
 * Shell-and-tube heat exchanger: the tube side passes W-E through the zigzag
 * bundle, the shell side N-S. No state, no drive.
 */
export function HeatExchanger() {
  return (
    <SymbolSvg label="Heat exchanger">
      <Pipe d="M0,48 H26" />
      <Pipe d="M70,48 H96" />
      <Pipe d="M48,0 V34" />
      <Pipe d="M48,62 V96" />
      <path className={styles.bodyFill} d={SHELL} />
      <path className={styles.detail} d="M26,48 H32 L36,39 L44,57 L52,39 L60,57 L64,48 H70" />
      <path className={styles.contour} d={SHELL} />
    </SymbolSvg>
  );
}
