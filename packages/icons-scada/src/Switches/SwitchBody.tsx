import { Pipe } from "../symbol/Symbol.js";
import styles from "../symbol/Symbol.module.css";

/**
 * Which way the medium takes through the three-way valve. The inlet is always
 * W. `straight` passes W to E and blocks S, `branch` passes W to S and blocks
 * E. Without a position nothing is asserted and all three triangles are plain.
 */
export type SwitchPosition = "straight" | "branch";

const BLOCKED: Record<SwitchPosition, "E" | "S"> = { straight: "S", branch: "E" };

function triangleClass(port: "W" | "E" | "S", position: SwitchPosition | undefined): string {
  if (position === undefined) {
    return styles.body ?? "";
  }
  return port === BLOCKED[position] ? (styles.solid ?? "") : (styles.passage ?? "");
}

/** Pipe stubs W, E and S, the filled inlet arrow on W, and the three triangles. */
export function SwitchBody({
  position,
  stemTo,
}: {
  position: SwitchPosition | undefined;
  stemTo: number;
}) {
  return (
    <>
      <Pipe d="M0,48 H30" />
      <Pipe d="M66,48 H96" />
      <Pipe d="M48,66 V96" />
      <path className={styles.solid} d="M8,41 L20,48 L8,55 Z" />
      <path className={styles.detail} d={`M48,48 V${stemTo}`} />
      <path className={triangleClass("W", position)} d="M30,38 V58 L48,48 Z" />
      <path className={triangleClass("E", position)} d="M66,38 V58 L48,48 Z" />
      <path className={triangleClass("S", position)} d="M38,66 H58 L48,48 Z" />
    </>
  );
}
