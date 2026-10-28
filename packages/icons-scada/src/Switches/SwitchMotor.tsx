import { MotorHead, StatePoint, SymbolSvg } from "../symbol/Symbol.js";
import type { ActuatorState } from "../symbol/states.js";
import { SwitchBody, type SwitchPosition } from "./SwitchBody.js";

export interface SwitchMotorProps {
  /** The drive's state; `stopped` is a hollow ring. */
  state?: ActuatorState | undefined;
  /** Where the medium goes; without it the position is not asserted. */
  position?: SwitchPosition | undefined;
}

/** Three-way valve with a motor: inlet W, outlets E and S. */
export function SwitchMotor({ state = "closed", position }: SwitchMotorProps) {
  return (
    <SymbolSvg label="Three-way valve with motor" state={state}>
      <SwitchBody position={position} stemTo={28} />
      <MotorHead />
      <StatePoint ring={state === "stopped"} />
    </SymbolSvg>
  );
}
