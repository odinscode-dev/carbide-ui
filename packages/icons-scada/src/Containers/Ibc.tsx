import { Pipe, StatePoint, SymbolSvg } from "../symbol/Symbol.js";
import styles from "../symbol/Symbol.module.css";
import type { ContainerState } from "../symbol/states.js";
import { VesselFill } from "../symbol/Vessel.js";

export interface IbcProps {
  fillLevel?: number | undefined;
  state?: ContainerState | undefined;
}

const OUTLINE = "M24,18 H72 V72 H24 Z";

/** Intermediate bulk container: tank in a lattice cage on a pallet, filler neck on top. */
export function Ibc({ fillLevel = 60, state = "fillable" }: IbcProps) {
  return (
    <SymbolSvg label="IBC" state={state}>
      <Pipe d="M48,0 V12" />
      <Pipe d="M48,78 V96" />
      <VesselFill box={{ x: 24, y: 18, width: 48, height: 54 }} d={OUTLINE} level={fillLevel} />
      <path className={styles.detail} d="M40,18 V72 M56,18 V72 M24,36 H72 M24,54 H72" />
      <path className={styles.contour} d={OUTLINE} />
      <rect className={styles.body} height="6" width="56" x="20" y="72" />
      <rect className={styles.body} height="6" width="12" x="42" y="12" />
      <StatePoint />
    </SymbolSvg>
  );
}
