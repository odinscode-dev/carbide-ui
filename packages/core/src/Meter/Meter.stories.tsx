import type { Meta, StoryObj } from "@storybook/react-vite";
import { matrix } from "../../../../.storybook/matrix.js";
import { Meter } from "./Meter.js";

const percent = (value: number) => `${value} %`;

const meta: Meta<typeof Meter> = {
  title: "Components/Meter",
  component: Meter,
  args: { label: "Exhaust", value: 40, format: percent },
  decorators: [
    (Story) => (
      <div style={{ width: "16rem" }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof Meter>;

export const Default: Story = {};

// The exhaust never runs below 20 %: a mark at the minimum.
export const MitMarke: Story = { args: { marks: [{ value: 20, label: "Minimum" }] } };

export const Farbe: Story = { args: { color: "var(--carbide-chart-series-6)" } };

export const Leer: Story = { args: { value: 0 } };

export const Voll: Story = { args: { value: 100 } };

// Beyond the scale the fill stops at its end.
export const Ausserhalb: Story = { args: { value: 140 } };

export const Matrix: Story = {
  decorators: [matrix],
  parameters: { layout: "fullscreen" },
  render: () => (
    <div style={{ display: "grid", gap: "var(--carbide-sp-4)", width: "14rem" }}>
      <Meter label="Empty" value={0} />
      <Meter label="Default" value={40} />
      <Meter
        color="var(--carbide-chart-series-6)"
        label="With mark"
        marks={[{ value: 20, label: "Minimum" }]}
        value={65}
      />
      <Meter color="var(--carbide-signal-alarm)" label="Full" value={100} />
    </div>
  ),
};
