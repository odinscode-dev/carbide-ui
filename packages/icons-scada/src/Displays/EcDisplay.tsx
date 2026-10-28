import { type DisplayProps, TappedDisplay } from "./TappedDisplay.js";

export type EcDisplayProps = DisplayProps;

export function EcDisplay({ state = "ok" }: EcDisplayProps) {
  return <TappedDisplay fontSize={12} label="EC display" letter="EC" state={state} />;
}
