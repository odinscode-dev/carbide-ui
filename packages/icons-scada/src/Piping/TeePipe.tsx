import { Pipe, SymbolSvg } from "../symbol/Symbol.js";

/** Tee, W-E with a branch to S. */
export function TeePipe() {
  return (
    <SymbolSvg label="Pipe, tee">
      <Pipe d="M0,48 H96" />
      <Pipe d="M48,48 V96" />
    </SymbolSvg>
  );
}
