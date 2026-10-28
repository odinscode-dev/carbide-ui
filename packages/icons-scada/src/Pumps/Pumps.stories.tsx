import type { Meta, StoryObj } from "@storybook/react-vite";
import { SymbolSheet } from "../symbol/SymbolSheet.js";
import type { EquipmentState } from "../symbol/states.js";
import { CentrifugalPump } from "./CentrifugalPump.js";
import { DiaphragmPump } from "./DiaphragmPump.js";
import { DosingPump } from "./DosingPump.js";

const STATES: EquipmentState[] = ["stopped", "running", "warning", "alarm", "fault"];

function row(name: string, tag: string, render: (state: EquipmentState) => React.JSX.Element) {
  return { name, tag, cells: STATES.map((state) => ({ label: state, symbol: render(state) })) };
}

const ROWS = [
  row("Centrifugal pump", "P-101", (state) => <CentrifugalPump state={state} />),
  row("Diaphragm pump", "P-102", (state) => <DiaphragmPump state={state} />),
  row("Dosing pump (diaphragm pump + drive)", "P-103", (state) => <DosingPump state={state} />),
];

function PumpSheet() {
  return (
    <SymbolSheet
      note="Three pumps, five states each (stopped, running, warning, alarm, fault). A running centrifugal pump spins its impeller, a confirmed exception to no infinite loops. Diaphragm and dosing pumps have no rotating drive and no animation."
      rows={ROWS}
    />
  );
}

const meta: Meta<typeof PumpSheet> = {
  title: "PlantSymbols/Pumps",
  component: PumpSheet,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof PumpSheet>;

export const Standard: Story = {};
