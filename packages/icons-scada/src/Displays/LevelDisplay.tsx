import { type DisplayProps, TappedDisplay } from "./TappedDisplay.js";

export type LevelDisplayProps = DisplayProps;

export function LevelDisplay({ state = "ok" }: LevelDisplayProps) {
  return <TappedDisplay fontSize={14} label="Level display" letter="L" state={state} />;
}
