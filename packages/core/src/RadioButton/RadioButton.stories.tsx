import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { matrix } from "../../../../.storybook/matrix.js";
import { RadioButton, RadioGroup, type RadioGroupProps } from "./RadioButton.js";

function Options() {
  return (
    <>
      <RadioButton label="Automatic" value="auto" />
      <RadioButton label="Manual" value="manual" />
      <RadioButton disabled label="Service (locked)" value="service" />
    </>
  );
}

function ControlledGroup(props: Omit<RadioGroupProps, "children">) {
  const [value, setValue] = useState(props.value);
  return (
    <RadioGroup {...props} onValueChange={setValue} value={value}>
      <Options />
    </RadioGroup>
  );
}

const meta: Meta<typeof RadioGroup> = {
  title: "Core/RadioButton",
  component: RadioGroup,
  args: { label: "Operating mode", value: "auto" },
  argTypes: { onValueChange: { control: false }, children: { control: false } },
  render: (args) => <ControlledGroup {...args} />,
};
export default meta;

type Story = StoryObj<typeof RadioGroup>;

export const Default: Story = {};

export const Horizontal: Story = { args: { orientation: "horizontal" } };

export const Empty: Story = { args: { value: undefined } };

export const Disabled: Story = { args: { disabled: true } };

export const Invalid: Story = { args: { invalid: true } };

export const LongLabels: Story = {
  args: { orientation: "horizontal" },
  render: (args) => (
    <div style={{ width: "20rem" }}>
      <RadioGroup {...args}>
        <RadioButton label="Automatic control by the sequence program" value="auto" />
        <RadioButton label="Manual control from the operator station" value="manual" />
      </RadioGroup>
    </div>
  ),
};

export const Matrix: Story = {
  decorators: [matrix],
  parameters: { layout: "fullscreen" },
  render: () => (
    <div style={{ display: "grid", gap: "var(--carbide-sp-5)", width: "13rem" }}>
      <RadioGroup label="Operating mode" value="auto">
        <Options />
      </RadioGroup>
      <RadioGroup label="Horizontal" orientation="horizontal" value="manual">
        <RadioButton label="Auto" value="auto" />
        <RadioButton label="Manual" value="manual" />
      </RadioGroup>
      <RadioGroup label="Nothing selected">
        <RadioButton label="Auto" value="auto" />
        <RadioButton label="Manual" value="manual" />
      </RadioGroup>
      <RadioGroup invalid label="Invalid" value="auto">
        <RadioButton label="Auto" value="auto" />
        <RadioButton label="Manual" value="manual" />
      </RadioGroup>
      <RadioGroup disabled label="Disabled" value="auto">
        <RadioButton label="Auto" value="auto" />
        <RadioButton label="Manual" value="manual" />
      </RadioGroup>
    </div>
  ),
};
