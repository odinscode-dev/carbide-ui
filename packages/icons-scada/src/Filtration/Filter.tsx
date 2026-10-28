import { Pipe, SymbolSvg } from "../symbol/Symbol.js";
import styles from "../symbol/Symbol.module.css";

/** Filter in the line (W-E): a box with three diagonals. No state, no drive. */
export function Filter() {
  return (
    <SymbolSvg label="Filter">
      <Pipe d="M0,48 H32" />
      <Pipe d="M64,48 H96" />
      <path className={styles.bodyFill} d="M32,36 H64 V60 H32 Z" />
      <path className={styles.detail} d="M36,60 L44,36 M44,60 L52,36 M52,60 L60,36" />
      <path className={styles.contour} d="M32,36 H64 V60 H32 Z" />
    </SymbolSvg>
  );
}
