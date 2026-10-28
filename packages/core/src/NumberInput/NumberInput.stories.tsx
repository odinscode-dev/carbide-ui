import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { matrix } from "../../../../.storybook/matrix.js";
import { NumberInput, type NumberInputProps } from "./NumberInput.js";

function ControlledField(props: NumberInputProps) {
  const [value, setValue] = useState<number | undefined>(props.value);
  return (
    <div style={{ display: "grid", gap: "var(--carbide-sp-3)" }}>
      <NumberInput {...props} onValueChange={(next) => setValue(next ?? undefined)} value={value} />
      <span
        style={{
          color: "var(--carbide-text-helper)",
          fontFamily: "var(--carbide-font-mono)",
          fontSize: "var(--carbide-fs-small)",
        }}
      >
        {value === undefined ? "null" : String(value)}
      </span>
    </div>
  );
}

const meta: Meta<typeof NumberInput> = {
  title: "Core/NumberInput",
  component: NumberInput,
  args: { label: "Pressure setpoint", value: 2.4, step: 0.1, unit: "bar" },
  argTypes: {
    onValueChange: { control: false },
    step: { control: "select", options: [0.1, 1, 10, 100, 1000] },
  },
  render: (args) => <ControlledField {...args} />,
  decorators: [
    (Story) => (
      <div style={{ width: "16rem" }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof NumberInput>;

export const Default: Story = {};

export const WithoutUnit: Story = {
  args: { label: "Batch count", step: 1, unit: undefined, value: 12 },
};

export const LargeStep: Story = {
  args: { label: "Target speed", step: 1000, unit: "rpm", value: 3000 },
};

export const AtMin: Story = { args: { min: 0, max: 10, step: 1, value: 0, unit: "bar" } };

export const AtMax: Story = { args: { min: 0, max: 10, step: 1, value: 10, unit: "bar" } };

export const Invalid: Story = {
  args: { invalid: true, errorText: "Above the safety limit of 6 bar", value: 8.2 },
};

export const Disabled: Story = { args: { disabled: true } };

export const ReadOnly: Story = { args: { readOnly: true } };

export const LargeValue: Story = {
  args: {
    label: "Accumulated volume since the last maintenance window",
    step: 1000,
    unit: "l",
    value: 1234567.8,
  },
};

export const Matrix: Story = {
  decorators: [matrix],
  parameters: { layout: "fullscreen" },
  render: () => (
    <div style={{ display: "grid", gap: "var(--carbide-sp-5)", width: "15rem" }}>
      <NumberInput label="Pressure setpoint" step={0.1} unit="bar" value={2.4} />
      <NumberInput label="Pressure setpoint" step={1} unit="bar" value={12} />
      <NumberInput label="Level" max={10} min={0} step={1} unit="%" value={10} />
      <NumberInput
        errorText="Above the safety limit of 6 bar"
        invalid
        label="Pressure setpoint"
        unit="bar"
        value={8.2}
      />
      <NumberInput label="Pressure setpoint" readOnly unit="bar" value={2.4} />
      <NumberInput disabled label="Pressure setpoint" unit="bar" value={2.4} />
    </div>
  ),
};
