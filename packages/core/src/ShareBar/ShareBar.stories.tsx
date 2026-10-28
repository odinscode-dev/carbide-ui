import type { Meta, StoryObj } from "@storybook/react-vite";
import { matrix } from "../../../../.storybook/matrix.js";
import { ShareBar, type ShareBarPart } from "./ShareBar.js";

const DAY: ShareBarPart[] = [
  { label: "Heating", value: 12, color: "var(--carbide-chart-series-3)" },
  { label: "Humidifying", value: 30, color: "var(--carbide-chart-series-5)" },
  { label: "Exhaust", value: 18, color: "var(--carbide-chart-series-6)" },
  { label: "Idle", value: 40, color: "var(--carbide-border-strong)" },
];

const meta: Meta<typeof ShareBar> = {
  title: "Components/ShareBar",
  component: ShareBar,
  args: { label: "Actions today", parts: DAY },
  decorators: [
    (Story) => (
      <div style={{ width: "16rem" }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof ShareBar>;

export const Default: Story = {};

// Equal parts in a row, one per cycle, each in the colour of what it did.
export const Folge: Story = {
  args: {
    label: "Last cycles",
    parts: [3, 5, 5, 6, 6, 6, 3, 6].map((slot) => ({
      label: `Cycle`,
      value: 1,
      color: `var(--carbide-chart-series-${slot})`,
    })),
  },
};

export const Leer: Story = { args: { parts: [] } };

export const Matrix: Story = {
  decorators: [matrix],
  parameters: { layout: "fullscreen" },
  render: () => (
    <div style={{ display: "grid", gap: "var(--carbide-sp-4)", width: "14rem" }}>
      <ShareBar label="Actions" parts={DAY} />
      <ShareBar label="Empty" parts={[]} />
    </div>
  ),
};
