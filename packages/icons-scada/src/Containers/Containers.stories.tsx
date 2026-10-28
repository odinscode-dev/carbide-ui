import type { Meta, StoryObj } from "@storybook/react-vite";
import { SymbolSheet } from "../symbol/SymbolSheet.js";
import type { ContainerState } from "../symbol/states.js";
import { ConicalTank } from "./ConicalTank.js";
import { CylindricalTank } from "./CylindricalTank.js";
import { Ibc } from "./Ibc.js";

/** A fill level that matches the state, so the area and the point tell the same story. */
const LEVEL: Record<ContainerState, number> = {
  fillable: 40,
  empty: 0,
  full: 90,
  overfilled: 100,
  locked: 40,
};

const STATES: ContainerState[] = ["fillable", "empty", "full", "overfilled", "locked"];

const ROWS = [
  {
    name: "Conical tank",
    tag: "T-101",
    cells: STATES.map((state) => ({
      label: state,
      symbol: <ConicalTank fillLevel={LEVEL[state]} state={state} />,
    })),
  },
  {
    name: "Cylindrical tank, flat lid and bottom",
    tag: "T-102",
    cells: STATES.map((state) => ({
      label: state,
      symbol: <CylindricalTank fillLevel={LEVEL[state]} state={state} />,
    })),
  },
  {
    name: "IBC",
    tag: "T-103",
    cells: STATES.map((state) => ({
      label: state,
      symbol: <Ibc fillLevel={LEVEL[state]} state={state} />,
    })),
  },
];

function ContainerSheet() {
  return (
    <SymbolSheet
      note="Three containers, five states each (fillable, empty, full, overfilled, locked): a container neither runs nor stops, its state says whether it can take more. The fill area is clipped to the silhouette. Inlet N, outlet S, both on the module's edge."
      rows={ROWS}
    />
  );
}

const meta: Meta<typeof ContainerSheet> = {
  title: "PlantSymbols/Containers",
  component: ContainerSheet,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof ContainerSheet>;

export const Standard: Story = {};
