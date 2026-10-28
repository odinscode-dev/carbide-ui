import type { Meta, StoryObj } from "@storybook/react-vite";
import { matrix } from "../../../../.storybook/matrix.js";
import { ProgressBar } from "./ProgressBar.js";

const meta: Meta<typeof ProgressBar> = {
  title: "Core/ProgressBar",
  component: ProgressBar,
  args: { label: "Filling tank 2", value: 42 },
  decorators: [
    (Story) => (
      <div style={{ width: "22rem" }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof ProgressBar>;

export const Default: Story = {};

export const Empty: Story = { args: { value: 0 } };

export const Full: Story = { args: { value: 100 } };

export const OtherMax: Story = { args: { value: 300, max: 1200, helperText: "300 of 1200 l" } };

export const Indeterminate: Story = {
  args: { indeterminate: true, helperText: "Waiting for PLC" },
};

export const WithHelperText: Story = { args: { helperText: "About 4 minutes left" } };

export const Ok: Story = { args: { value: 100, state: "ok", helperText: "Tank 2 filled" } };

export const Alarm: Story = { args: { value: 68, state: "alarm", helperText: "Valve 3 blocked" } };

export const LongLabel: Story = {
  args: { label: "Filling tank 2 of hall 1 from the intermediate storage on level 3" },
};

export const Matrix: Story = {
  decorators: [matrix],
  parameters: { layout: "fullscreen" },
  render: () => (
    <div style={{ display: "grid", gap: "var(--carbide-sp-5)", width: "14rem" }}>
      <ProgressBar helperText="About 4 minutes left" label="Filling" value={42} />
      <ProgressBar indeterminate label="Waiting" />
      <ProgressBar label="Filled" state="ok" value={100} />
      <ProgressBar helperText="Valve 3 blocked" label="Stopped" state="alarm" value={68} />
    </div>
  ),
};
