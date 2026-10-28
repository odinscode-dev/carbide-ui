import type { Meta, StoryObj } from "@storybook/react-vite";
import { matrix } from "../../../../.storybook/matrix.js";
import { CellStrip, type CellStripCell } from "./CellStrip.js";

const WEEK: CellStripCell[] = [
  { label: "Thu 22.10.: 96 %", tone: "ok" },
  { label: "Fri 23.10.: 92 %", tone: "ok" },
  { label: "Sat 24.10.: 81 %", tone: "warning" },
  { label: "Sun 25.10.: 94 %", tone: "ok" },
  { label: "Mon 26.10.: 64 %", tone: "alarm" },
  { label: "Tue 27.10.: 90 %", tone: "ok" },
  { label: "Wed 28.10.: no data", tone: "neutral" },
];

const meta: Meta<typeof CellStrip> = {
  title: "Components/CellStrip",
  component: CellStrip,
  args: { label: "Days in band", cells: WEEK },
  decorators: [
    (Story) => (
      <div style={{ width: "12rem" }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof CellStrip>;

export const Default: Story = {};

export const Leer: Story = { args: { cells: [] } };

export const Matrix: Story = {
  decorators: [matrix],
  parameters: { layout: "fullscreen" },
  render: () => (
    <div style={{ width: "12rem" }}>
      <CellStrip cells={WEEK} label="Days in band" />
    </div>
  ),
};
