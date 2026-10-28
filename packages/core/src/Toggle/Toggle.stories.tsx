import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { matrix } from "../../../../.storybook/matrix.js";
import { Toggle, type ToggleProps } from "./Toggle.js";

function ControlledToggle(props: ToggleProps) {
  const [checked, setChecked] = useState(props.checked ?? false);
  return <Toggle {...props} checked={checked} onCheckedChange={setChecked} />;
}

const meta: Meta<typeof Toggle> = {
  title: "Core/Toggle",
  component: Toggle,
  args: { label: "Pump P-101", checked: false },
  argTypes: { onCheckedChange: { control: false } },
  render: (args) => <ControlledToggle {...args} />,
};
export default meta;

type Story = StoryObj<typeof Toggle>;

export const Default: Story = {};

export const On: Story = { args: { checked: true } };

export const Disabled: Story = { args: { disabled: true } };

export const DisabledOn: Story = { args: { disabled: true, checked: true } };

export const LabelAtEnd: Story = { args: { labelPosition: "end" } };

export const CustomStateText: Story = {
  args: { checked: true, offText: "Stopped", onText: "Running" },
};

export const LongLabel: Story = {
  args: { label: "Allow the sequence program to start pump P-101 without confirmation" },
  decorators: [
    (Story) => (
      <div style={{ width: "20rem" }}>
        <Story />
      </div>
    ),
  ],
};

export const Matrix: Story = {
  decorators: [matrix],
  parameters: { layout: "fullscreen" },
  render: () => (
    <div style={{ display: "grid", gap: "var(--carbide-sp-2)", width: "14rem" }}>
      <Toggle label="Pump P-101" />
      <Toggle checked label="Pump P-101" />
      <Toggle checked label="Label at end" labelPosition="end" />
      <Toggle checked offText="Stopped" onText="Running" label="Custom text" />
      <Toggle disabled label="Disabled" />
      <Toggle checked disabled label="Disabled on" />
    </div>
  ),
};
