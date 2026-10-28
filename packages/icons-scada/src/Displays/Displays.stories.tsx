import type { Meta, StoryObj } from "@storybook/react-vite";
import { SymbolSheet } from "../symbol/SymbolSheet.js";
import type { DisplayState } from "../symbol/states.js";
import { CurrentDisplay } from "./CurrentDisplay.js";
import { EcDisplay } from "./EcDisplay.js";
import { FlowDisplay } from "./FlowDisplay.js";
import { LevelDisplay } from "./LevelDisplay.js";
import { PhDisplay } from "./PhDisplay.js";
import { PressureDisplay } from "./PressureDisplay.js";

const STATES: DisplayState[] = ["ok", "warning", "alarm", "fault"];

function row(name: string, tag: string, render: (state: DisplayState) => React.JSX.Element) {
  return { name, tag, cells: STATES.map((state) => ({ label: state, symbol: render(state) })) };
}

const ROWS = [
  row("Flow (F), in the line", "FIT-101", (state) => <FlowDisplay state={state} />),
  row("Pressure (P)", "PIT-101", (state) => <PressureDisplay state={state} />),
  row("Level (L)", "LIT-101", (state) => <LevelDisplay state={state} />),
  row("pH", "AIT-101", (state) => <PhDisplay state={state} />),
  row("EC", "AIT-102", (state) => <EcDisplay state={state} />),
  row("Current (I), on a conductor", "IIT-101", (state) => <CurrentDisplay state={state} />),
];

function DisplaySheet() {
  return (
    <SymbolSheet
      note="Six displays, four states each (ok, warning, alarm, fault): a display measures, it does not run or stop, so ok is green. Flow sits in the line, pressure, level, pH and EC on a tap above it, current on a dashed conductor."
      rows={ROWS}
    />
  );
}

const meta: Meta<typeof DisplaySheet> = {
  title: "PlantSymbols/Displays",
  component: DisplaySheet,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof DisplaySheet>;

export const Standard: Story = {};
