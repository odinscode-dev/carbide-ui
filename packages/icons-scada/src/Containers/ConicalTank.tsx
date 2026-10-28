import { Pipe, StatePoint, SymbolSvg } from "../symbol/Symbol.js";
import styles from "../symbol/Symbol.module.css";
import type { ContainerState } from "../symbol/states.js";
import { VesselFill } from "../symbol/Vessel.js";

export interface ConicalTankProps {
  fillLevel?: number | undefined;
  state?: ContainerState | undefined;
}

const OUTLINE = "M26,18 H70 V54 L52,78 H44 L26,54 Z";

/** Cone-bottom tank: inlet N, outlet S through the flange at the cone's tip. */
export function ConicalTank({ fillLevel = 60, state = "fillable" }: ConicalTankProps) {
  return (
    <SymbolSvg label="Conical tank" state={state}>
      <Pipe d="M48,0 V18" />
      <Pipe d="M48,78 V96" />
      <VesselFill box={{ x: 26, y: 18, width: 44, height: 60 }} d={OUTLINE} level={fillLevel} />
      <path className={styles.contour} d={OUTLINE} />
      <StatePoint />
    </SymbolSvg>
  );
}
