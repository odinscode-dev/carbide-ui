import { Pipe, StatePoint, SymbolSvg } from "../symbol/Symbol.js";
import styles from "../symbol/Symbol.module.css";
import type { EquipmentState } from "../symbol/states.js";

export interface CentrifugalPumpProps {
  state?: EquipmentState | undefined;
}

const SPOKE_ANGLES = [0, 72, 144, 216, 288] as const;

/** Centrifugal pump: suction W, discharge N, impeller of five spokes. */
export function CentrifugalPump({ state = "running" }: CentrifugalPumpProps) {
  return (
    <SymbolSvg label="Centrifugal pump" state={state}>
      <Pipe d="M0,48 H26" />
      <Pipe d="M48,0 V26" />
      <circle className={styles.body} cx="48" cy="48" r="22" />
      <g className={styles.impeller}>
        {SPOKE_ANGLES.map((angle) => (
          <path
            className={styles.detail}
            d="M48,48 V32"
            key={angle}
            transform={`rotate(${angle} 48 48)`}
          />
        ))}
      </g>
      <circle className={styles.solid} cx="48" cy="48" r="3" />
      <StatePoint />
    </SymbolSvg>
  );
}
