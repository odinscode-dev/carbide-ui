import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { matrix } from "../../../../.storybook/matrix.js";
import { TextInput, type TextInputProps } from "./TextInput.js";

function ControlledField(props: TextInputProps) {
  const [value, setValue] = useState(props.value ?? "");
  return <TextInput {...props} onValueChange={setValue} value={value} />;
}

const meta: Meta<typeof TextInput> = {
  title: "Core/TextInput",
  component: TextInput,
  args: {
    label: "Setpoint name",
    placeholder: "Enter a name",
    helperText: "Shown in the operator list",
    value: "",
  },
  argTypes: { onValueChange: { control: false }, onChange: { control: false } },
  render: (args) => <ControlledField {...args} />,
  decorators: [
    (Story) => (
      <div style={{ width: "18rem" }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof TextInput>;

export const Default: Story = {};

export const Invalid: Story = {
  args: { invalid: true, errorText: "A name must not be empty", value: "" },
};

export const Disabled: Story = { args: { disabled: true, value: "Cooling circuit" } };

export const ReadOnly: Story = { args: { readOnly: true, value: "Cooling circuit" } };

export const WithPrefix: Story = {
  args: { label: "Tag", prefix: "PLC-", value: "1042", helperText: undefined },
};

export const WithSuffix: Story = {
  args: { label: "Pressure limit", suffix: "bar", value: "2.40", helperText: undefined },
};

export const WithPrefixAndSuffix: Story = {
  args: { label: "Flow limit", prefix: "max", suffix: "l/min", value: "12.5" },
};

export const LongValue: Story = {
  args: {
    label: "Name of the setpoint as the operator sees it in the list",
    value: "Cooling circuit inlet pressure high limit warning",
    helperText: "This helper text is longer than the field is wide, and it wraps",
  },
};

export const Matrix: Story = {
  decorators: [matrix],
  parameters: { layout: "fullscreen" },
  render: () => (
    <div style={{ display: "grid", gap: "var(--carbide-sp-5)", width: "14rem" }}>
      <TextInput helperText="Shown in the operator list" label="Setpoint name" value="Inlet" />
      <TextInput label="Tag" prefix="PLC-" value="1042" />
      <TextInput label="Pressure limit" suffix="bar" value="2.40" />
      <TextInput errorText="A name must not be empty" invalid label="Setpoint name" value="" />
      <TextInput label="Setpoint name" readOnly value="Cooling circuit" />
      <TextInput disabled label="Setpoint name" value="Cooling circuit" />
    </div>
  ),
};
