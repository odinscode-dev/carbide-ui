import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { matrix } from "../../../../.storybook/matrix.js";
import { type RangeSliderProps, type SingleSliderProps, Slider } from "./Slider.js";

function ControlledSlider(props: SingleSliderProps) {
  const [value, setValue] = useState(props.value);
  return <Slider {...props} onValueChange={setValue} value={value} />;
}

function ControlledRange(props: RangeSliderProps) {
  const [value, setValue] = useState<[number, number]>([...props.value]);
  return <Slider {...props} onValueChange={setValue} value={value} />;
}

const meta: Meta<SingleSliderProps> = {
  title: "Core/Slider",
  component: Slider,
  args: { label: "Setpoint", value: 40, min: 0, max: 100, step: 1 },
  argTypes: { onValueChange: { control: false } },
  render: (args) => <ControlledSlider {...args} />,
  decorators: [
    (Story) => (
      <div style={{ width: "20rem" }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<SingleSliderProps>;

export const Default: Story = {};

export const WithUnit: Story = {
  args: { label: "Pressure limit", max: 6, min: 0, step: 0.1, unit: "bar", value: 2.4 },
};

export const WithTicks: Story = { args: { ticks: [25, 50, 75] } };

export const Range: StoryObj<RangeSliderProps> = {
  args: { label: "Alarm band", unit: "°C", value: [18, 26], min: 0, max: 40, ticks: [20] },
  render: (args) => <ControlledRange {...args} />,
};

export const Invalid: Story = { args: { invalid: true, value: 95 } };

export const Disabled: Story = { args: { disabled: true } };

export const LongLabel: Story = {
  args: {
    label: "Maximum flow through the inlet of the cooling circuit",
    max: 100000,
    unit: "l/min",
    value: 12500.5,
    step: 0.5,
  },
};

export const Matrix: Story = {
  decorators: [matrix],
  parameters: { layout: "fullscreen" },
  render: () => (
    <div style={{ display: "grid", gap: "var(--carbide-sp-5)", width: "16rem", maxWidth: "100%" }}>
      <Slider label="Single" unit="bar" value={2.4} max={6} min={0} step={0.1} />
      <Slider label="Range with ticks" ticks={[25, 50, 75]} value={[20, 60]} />
      <Slider invalid label="Invalid" value={95} />
      <Slider disabled label="Disabled" ticks={[50]} value={40} />
    </div>
  ),
};
