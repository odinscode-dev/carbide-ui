import { Pipe, SymbolSvg } from "../symbol/Symbol.js";
import styles from "../symbol/Symbol.module.css";

/** Static mixer in the line (W-E): a pipe section with four baffles. No drive, no state. */
export function StaticMixer() {
  return (
    <SymbolSvg label="Static mixer">
      <Pipe d="M0,48 H24" />
      <Pipe d="M72,48 H96" />
      <path className={styles.bodyFill} d="M24,36 H72 V60 H24 Z" />
      <path className={styles.detail} d="M26,60 L34,48 M38,36 L46,48 M50,60 L58,48 M62,36 L70,48" />
      <path className={styles.contour} d="M24,36 H72 V60 H24 Z" />
    </SymbolSvg>
  );
}
