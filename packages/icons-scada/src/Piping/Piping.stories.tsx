import type { Meta, StoryObj } from "@storybook/react-vite";
import { SymbolSheet } from "../symbol/SymbolSheet.js";
import { CrossPipe } from "./CrossPipe.js";
import { Drain } from "./Drain.js";
import { Dripper } from "./Dripper.js";
import { ElbowPipe } from "./ElbowPipe.js";
import { Manifold2 } from "./Manifold2.js";
import { Manifold4 } from "./Manifold4.js";
import { Manifold6 } from "./Manifold6.js";
import { Manifold8 } from "./Manifold8.js";
import { Nozzle } from "./Nozzle.js";
import { StraightPipe } from "./StraightPipe.js";
import { TeePipe } from "./TeePipe.js";

const ROWS = [
  {
    name: "Pipes",
    cells: [
      { label: "straight", symbol: <StraightPipe /> },
      { label: "elbow", symbol: <ElbowPipe /> },
      { label: "tee", symbol: <TeePipe /> },
      { label: "cross", symbol: <CrossPipe /> },
    ],
  },
  {
    name: "Ends",
    cells: [
      { label: "drain", symbol: <Drain /> },
      { label: "dripper", symbol: <Dripper /> },
      { label: "nozzle", symbol: <Nozzle /> },
    ],
  },
  {
    name: "Manifolds",
    cells: [
      { label: "2", symbol: <Manifold2 /> },
      { label: "4", symbol: <Manifold4 /> },
      { label: "6", symbol: <Manifold6 /> },
      { label: "8", symbol: <Manifold8 /> },
    ],
  },
];

function PipingSheet() {
  return (
    <SymbolSheet
      note="Pipes, the three open ends (drain with its air gap, dripper, nozzle) and the manifolds: a distributor block with outlets down. No state, no tag: piping elements are not fittings."
      rows={ROWS}
    />
  );
}

const meta: Meta<typeof PipingSheet> = {
  title: "PlantSymbols/Piping",
  component: PipingSheet,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof PipingSheet>;

export const Standard: Story = {};
