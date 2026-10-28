import type { Meta, StoryObj } from "@storybook/react-vite";
import { SymbolSheet } from "../symbol/SymbolSheet.js";
import type { ActuatorState } from "../symbol/states.js";
import type { SwitchPosition } from "./SwitchBody.js";
import { SwitchHandwheel } from "./SwitchHandwheel.js";
import { SwitchMotor } from "./SwitchMotor.js";

const ACTUATOR_STATES: ActuatorState[] = ["closed", "open", "moving", "fault", "stopped"];
const POSITIONS: SwitchPosition[] = ["straight", "branch"];

const ROWS = [
  {
    name: "Three-way valve with motor, W to E (straight)",
    tag: "V-201",
    cells: ACTUATOR_STATES.map((state) => ({
      label: state,
      symbol: <SwitchMotor position="straight" state={state} />,
    })),
  },
  {
    name: "Three-way valve with motor, W to S (branch)",
    tag: "V-202",
    cells: ACTUATOR_STATES.map((state) => ({
      label: state,
      symbol: <SwitchMotor position="branch" state={state} />,
    })),
  },
  {
    name: "Three-way valve with handwheel (no state)",
    tag: "V-203",
    cells: [
      ...POSITIONS.map((position) => ({
        label: position,
        symbol: <SwitchHandwheel position={position} />,
      })),
      { label: "not asserted", symbol: <SwitchHandwheel /> },
    ],
  },
];

function SwitchSheet() {
  return (
    <SymbolSheet
      note="Three-way valves: inlet W (the filled arrow on the pipe), outlets E and S. The grey passage is open, the black triangle is the blocked outlet; without a position nothing is asserted. The drive state is separate: the motor valve reports closed, open, moving, fault or stopped (hollow ring)."
      rows={ROWS}
    />
  );
}

const meta: Meta<typeof SwitchSheet> = {
  title: "PlantSymbols/Switches",
  component: SwitchSheet,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof SwitchSheet>;

export const Standard: Story = {};
