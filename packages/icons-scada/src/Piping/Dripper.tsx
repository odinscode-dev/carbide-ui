import { Pipe, SymbolSvg } from "../symbol/Symbol.js";
import styles from "../symbol/Symbol.module.css";

/** Dripper: the pipe from N ends in a trapezoid emitter with one drop. */
export function Dripper() {
  return (
    <SymbolSvg label="Dripper">
      <Pipe d="M48,0 V40" />
      <path className={styles.body} d="M40,40 H56 L52,54 H44 Z" />
      <path
        className={styles.liquid}
        d="M48,60 C45,64 43,67 43,70 A5,5 0 0 0 53,70 C53,67 51,64 48,60 Z"
      />
    </SymbolSvg>
  );
}
