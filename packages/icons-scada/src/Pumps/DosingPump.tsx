import { Motor, StatePoint, SymbolSvg } from "../symbol/Symbol.js";
import type { EquipmentState } from "../symbol/states.js";
import { DiaphragmPumpBody } from "./DiaphragmPump.js";

export interface DosingPumpProps {
  state?: EquipmentState | undefined;
}

/** Dosing pump: a diaphragm pump with a drive on top (circle with "M"). */
export function DosingPump({ state = "running" }: DosingPumpProps) {
  return (
    <SymbolSvg label="Dosing pump" state={state}>
      <DiaphragmPumpBody />
      <Motor stemFrom={36} />
      <StatePoint />
    </SymbolSvg>
  );
}
