import { Handwheel, SymbolSvg } from "../symbol/Symbol.js";
import { BallValveBody } from "./BallValveBody.js";

/** Ball valve with a handwheel: set by hand, nothing reports the position, so no state. */
export function BallValveHandwheel() {
  return (
    <SymbolSvg label="Ball valve with handwheel">
      <BallValveBody />
      <Handwheel stemFrom={42} />
    </SymbolSvg>
  );
}
