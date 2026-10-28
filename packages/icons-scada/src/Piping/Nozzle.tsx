import { Pipe, SymbolSvg } from "../symbol/Symbol.js";
import styles from "../symbol/Symbol.module.css";

/** Nozzle: the pipe from N ends in a triangle with five jets fanning out below. */
export function Nozzle() {
  return (
    <SymbolSvg label="Nozzle">
      <Pipe d="M48,0 V44" />
      <path className={styles.body} d="M40,44 H56 L48,60 Z" />
      <path
        className={styles.jet}
        d="M48,63 L32.7,75.9 M48,63 L39.5,81.1 M48,63 L48,83 M48,63 L56.5,81.1 M48,63 L63.3,75.9"
      />
    </SymbolSvg>
  );
}
