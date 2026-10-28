import type { ReactNode } from "react";
import styles from "./Symbol.module.css";

export interface SymbolSvgProps {
  label: string;
  /** Sets `data-state`; the stylesheet turns the name into the state point's colour. */
  state?: string | undefined;
  children: ReactNode;
}

/**
 * The frame of every symbol: a 96 x 96 module with the connection ports on its
 * edges (N 48,0 / S 48,96 / W 0,48 / E 96,48), so symbols placed on the 96 px
 * grid butt against each other.
 */
export function SymbolSvg({ label, state, children }: SymbolSvgProps) {
  return (
    <svg
      aria-label={label}
      className={styles.symbol}
      data-state={state}
      role="img"
      viewBox="0 0 96 96"
    >
      {children}
    </svg>
  );
}

/** The state point at the top right; a hollow ring where the position is not asserted. */
export function StatePoint({ ring = false }: { ring?: boolean }) {
  return <circle className={ring ? styles.ring : styles.state} cx="86" cy="12" r="7" />;
}

/** The motor circle with its "M" at (48, 18), for a drive whose stem the symbol draws itself. */
export function MotorHead() {
  return (
    <>
      <circle className={styles.body} cx="48" cy="18" r="10" />
      <text className={styles.label} fontSize="11" textAnchor="middle" x="48" y="22">
        M
      </text>
    </>
  );
}

/** Drive head: stem from `stemFrom` up to the motor circle. */
export function Motor({ stemFrom }: { stemFrom: number }) {
  return (
    <>
      <path className={styles.detail} d={`M48,${stemFrom} V28`} />
      <MotorHead />
    </>
  );
}

/** Hand drive: stem up to a bar at y = 30. */
export function Handwheel({ stemFrom }: { stemFrom: number }) {
  return (
    <>
      <path className={styles.detail} d={`M48,${stemFrom} V30`} />
      <path className={styles.detail} d="M36,30 H60" />
    </>
  );
}

/** A pipe stub between two points; ends are square so it butts exactly. */
export function Pipe({ d }: { d: string }) {
  return <path className={styles.pipe} d={d} />;
}
