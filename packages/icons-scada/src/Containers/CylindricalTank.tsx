import { Pipe, StatePoint, SymbolSvg } from "../symbol/Symbol.js";
import styles from "../symbol/Symbol.module.css";
import type { ContainerState } from "../symbol/states.js";
import { VesselFill } from "../symbol/Vessel.js";

export interface CylindricalTankProps {
  fillLevel?: number | undefined;
  state?: ContainerState | undefined;
}

const OUTLINE = "M26,18 H70 V78 H26 Z";

/** Upright cylindrical tank with a flat lid and a flat bottom: inlet N, outlet S. */
export function CylindricalTank({ fillLevel = 60, state = "fillable" }: CylindricalTankProps) {
  return (
    <SymbolSvg label="Cylindrical tank" state={state}>
      <Pipe d="M48,0 V18" />
      <Pipe d="M48,78 V96" />
      <VesselFill box={{ x: 26, y: 18, width: 44, height: 60 }} d={OUTLINE} level={fillLevel} />
      <path className={styles.contour} d={OUTLINE} />
      <path className={styles.detail} d="M23,18 H73" />
      <StatePoint />
    </SymbolSvg>
  );
}
