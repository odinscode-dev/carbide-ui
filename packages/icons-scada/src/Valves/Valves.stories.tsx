import type { Meta, StoryObj } from "@storybook/react-vite";
import { SymbolSheet } from "../symbol/SymbolSheet.js";
import type { ActuatorState, ReliefValveState } from "../symbol/states.js";
import { BallValveHandwheel } from "./BallValveHandwheel.js";
import { BallValveMotor } from "./BallValveMotor.js";
import { CheckValve } from "./CheckValve.js";
import { ReliefValve } from "./ReliefValve.js";

const ACTUATOR_STATES: ActuatorState[] = ["closed", "open", "moving", "fault", "stopped"];
const RELIEF_STATES: ReliefValveState[] = ["ok", "alarm"];

const ROWS = [
  {
    name: "Ball valve with motor",
    tag: "V-101",
    cells: ACTUATOR_STATES.map((state) => ({
      label: state,
      symbol: <BallValveMotor state={state} />,
    })),
  },
  {
    name: "Ball valve with handwheel (no state)",
    tag: "V-102",
    cells: [{ label: "-", symbol: <BallValveHandwheel /> }],
  },
  {
    name: "Check valve, flows W to E (no state)",
    tag: "V-103",
    cells: [{ label: "-", symbol: <CheckValve /> }],
  },
  {
    name: "Relief valve, inlet S, outlet E",
    tag: "V-104",
    cells: RELIEF_STATES.map((state) => ({
      label: state,
      symbol: <ReliefValve state={state} />,
    })),
  },
];

function ValveSheet() {
  return (
    <SymbolSheet
      note="Four valves. The motor valve reports its drive (closed, open, moving, fault, stopped as a hollow ring). Valves set by hand and the check valve have no drive and so no state. The relief valve has exactly two (ok, alarm)."
      rows={ROWS}
    />
  );
}

const meta: Meta<typeof ValveSheet> = {
  title: "PlantSymbols/Valves",
  component: ValveSheet,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof ValveSheet>;

export const Standard: Story = {};
