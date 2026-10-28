import type { Meta, StoryObj } from "@storybook/react-vite";
import { HeatExchanger } from "../HeatTransfer/HeatExchanger.js";
import { StaticMixer } from "../Mixing/StaticMixer.js";
import { SymbolSheet } from "../symbol/SymbolSheet.js";
import { Filter } from "./Filter.js";

const ROWS = [
  {
    name: "In-line equipment",
    cells: [
      { label: "filter", symbol: <Filter /> },
      { label: "heat exchanger", symbol: <HeatExchanger /> },
      { label: "static mixer", symbol: <StaticMixer /> },
    ],
  },
];

function InlineSheet() {
  return (
    <SymbolSheet
      note="Filter, heat exchanger (tube side W-E, shell side N-S) and static mixer. None has a drive, so none has a state."
      rows={ROWS}
    />
  );
}

const meta: Meta<typeof InlineSheet> = {
  title: "PlantSymbols/Inline",
  component: InlineSheet,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof InlineSheet>;

export const Standard: Story = {};
