import { SymbolSvg } from "../symbol/Symbol.js";
import styles from "../symbol/Symbol.module.css";
import { SwitchBody, type SwitchPosition } from "./SwitchBody.js";

export interface SwitchHandwheelProps {
  /** Where the medium goes; set by hand, so the page says it. */
  position?: SwitchPosition | undefined;
}

/** Three-way valve with a handwheel: inlet W, outlets E and S. No state. */
export function SwitchHandwheel({ position }: SwitchHandwheelProps) {
  return (
    <SymbolSvg label="Three-way valve with handwheel">
      <SwitchBody position={position} stemTo={30} />
      <path className={styles.detail} d="M36,30 H60" />
    </SymbolSvg>
  );
}
