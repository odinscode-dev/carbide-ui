import { Pipe, StatePoint, SymbolSvg } from "../symbol/Symbol.js";
import styles from "../symbol/Symbol.module.css";
import type { EquipmentState } from "../symbol/states.js";

export interface DiaphragmPumpProps {
  state?: EquipmentState | undefined;
}

export function DiaphragmPumpBody() {
  return (
    <>
      <Pipe d="M0,48 H30" />
      <Pipe d="M66,48 H96" />
      <path className={styles.bodyFill} d="M30,36 H66 V60 H30 Z" />
      <path className={styles.detail} d="M30,48 Q48,32 66,48" />
      <path className={styles.contour} d="M30,36 H66 V60 H30 Z" />
    </>
  );
}

/** Diaphragm pump (W-E): a box with an arched diaphragm that springs from the pipe's centre line. */
export function DiaphragmPump({ state = "running" }: DiaphragmPumpProps) {
  return (
    <SymbolSvg label="Diaphragm pump" state={state}>
      <DiaphragmPumpBody />
      <StatePoint />
    </SymbolSvg>
  );
}
