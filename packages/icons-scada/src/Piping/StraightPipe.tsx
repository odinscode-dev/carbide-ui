import { Pipe, SymbolSvg } from "../symbol/Symbol.js";

/** Straight pipe, W-E. */
export function StraightPipe() {
  return (
    <SymbolSvg label="Pipe, straight">
      <Pipe d="M0,48 H96" />
    </SymbolSvg>
  );
}
