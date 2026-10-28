import { Motor, StatePoint, SymbolSvg } from "../symbol/Symbol.js";
import type { ActuatorState } from "../symbol/states.js";
import { BallValveBody } from "./BallValveBody.js";

export interface BallValveMotorProps {
  state?: ActuatorState | undefined;
}

/** Ball valve with a motor drive; the state is the drive's position. */
export function BallValveMotor({ state = "closed" }: BallValveMotorProps) {
  return (
    <SymbolSvg label="Ball valve with motor" state={state}>
      <BallValveBody />
      <Motor stemFrom={42} />
      <StatePoint ring={state === "stopped"} />
    </SymbolSvg>
  );
}
