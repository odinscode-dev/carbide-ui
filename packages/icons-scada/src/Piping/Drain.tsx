import { Pipe, SymbolSvg } from "../symbol/Symbol.js";
import styles from "../symbol/Symbol.module.css";

/**
 * Drain: the pipe from N ends in the air above an open funnel (tundish). The
 * 6 px air gap is the one deliberately loose pipe end in the set.
 */
export function Drain() {
  return (
    <SymbolSvg label="Drain">
      <Pipe d="M48,0 V52" />
      <path className={styles.body} d="M34,58 H62 L52,70 V78 H44 V70 Z" />
    </SymbolSvg>
  );
}
