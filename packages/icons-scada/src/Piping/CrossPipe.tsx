import { Pipe, SymbolSvg } from "../symbol/Symbol.js";

/** Cross junction, all four ports. */
export function CrossPipe() {
  return (
    <SymbolSvg label="Pipe, cross junction">
      <Pipe d="M0,48 H96" />
      <Pipe d="M48,0 V96" />
    </SymbolSvg>
  );
}
