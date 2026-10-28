import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { matrix } from "../../../../.storybook/matrix.js";
import { Checkbox, type CheckboxProps } from "./Checkbox.js";

function ControlledCheckbox(props: CheckboxProps) {
  const [checked, setChecked] = useState(props.checked ?? false);
  return <Checkbox {...props} checked={checked} onCheckedChange={setChecked} />;
}

const meta: Meta<typeof Checkbox> = {
  title: "Core/Checkbox",
  component: Checkbox,
  args: { label: "Log every setpoint change", checked: false },
  argTypes: { onCheckedChange: { control: false } },
  render: (args) => <ControlledCheckbox {...args} />,
};
export default meta;

type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {};

export const Checked: Story = { args: { checked: true } };

export const Indeterminate: Story = { args: { indeterminate: true } };

export const Disabled: Story = { args: { disabled: true } };

export const DisabledChecked: Story = { args: { disabled: true, checked: true } };

export const Invalid: Story = { args: { invalid: true } };

export const HideLabel: Story = { args: { hideLabel: true } };

export const LongLabel: Story = {
  args: {
    label:
      "Log every setpoint change to the audit trail, including the operator name and the previous value",
  },
  decorators: [
    (Story) => (
      <div style={{ width: "18rem" }}>
        <Story />
      </div>
    ),
  ],
};

export const Matrix: Story = {
  decorators: [matrix],
  parameters: { layout: "fullscreen" },
  render: () => (
    <div style={{ display: "grid", gap: "var(--carbide-sp-2)", width: "12rem" }}>
      <Checkbox label="Unchecked" />
      <Checkbox checked label="Checked" />
      <Checkbox indeterminate label="Indeterminate" />
      <Checkbox invalid label="Invalid" />
      <Checkbox disabled label="Disabled" />
      <Checkbox checked disabled label="Disabled checked" />
    </div>
  ),
};
