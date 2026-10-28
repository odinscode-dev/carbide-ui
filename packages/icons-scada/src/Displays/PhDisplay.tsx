import { type DisplayProps, TappedDisplay } from "./TappedDisplay.js";

export type PhDisplayProps = DisplayProps;

export function PhDisplay({ state = "ok" }: PhDisplayProps) {
  return <TappedDisplay fontSize={12} label="pH display" letter="pH" state={state} />;
}
