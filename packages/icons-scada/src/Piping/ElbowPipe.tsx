import { Pipe, SymbolSvg } from "../symbol/Symbol.js";

/** Elbow, W-S, one path with a mitred corner. */
export function ElbowPipe() {
  return (
    <SymbolSvg label="Pipe, elbow">
      <Pipe d="M0,48 H48 V96" />
    </SymbolSvg>
  );
}
