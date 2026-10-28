import { type DisplayProps, TappedDisplay } from "./TappedDisplay.js";

export type PressureDisplayProps = DisplayProps;

export function PressureDisplay({ state = "ok" }: PressureDisplayProps) {
  return <TappedDisplay fontSize={14} label="Pressure display" letter="P" state={state} />;
}
