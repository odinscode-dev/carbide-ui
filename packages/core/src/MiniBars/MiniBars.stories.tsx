import type { Meta, StoryObj } from "@storybook/react-vite";
import { matrix } from "../../../../.storybook/matrix.js";
import { MiniBars } from "./MiniBars.js";

const PULSES = [9, 8, 9, 8, 7, 8, 7, 6, 5, 6, 4, 3, 0, 0, 0, 0, 0, 0, 0, 0, null, null, null, null];
const HOURS = PULSES.map((_, hour) => `${hour}:00`);

const meta: Meta<typeof MiniBars> = {
  title: "Components/MiniBars",
  component: MiniBars,
  args: {
    label: "Heater pulses per hour",
    values: PULSES,
    slots: HOURS,
    color: "var(--carbide-chart-series-3)",
  },
  decorators: [
    (Story) => (
      <div style={{ width: "16rem", height: "3rem" }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof MiniBars>;

export const Default: Story = {};

// A fixed top instead of the largest value, so two strips compare.
export const FesterHoechstwert: Story = { args: { max: 20 } };

export const Leer: Story = { args: { values: [0, 0, 0, null, null] } };

export const Matrix: Story = {
  decorators: [matrix],
  parameters: { layout: "fullscreen" },
  render: () => (
    <div style={{ width: "14rem", height: "3rem" }}>
      <MiniBars
        color="var(--carbide-chart-series-3)"
        label="Pulses"
        slots={HOURS}
        values={PULSES}
      />
    </div>
  ),
};
