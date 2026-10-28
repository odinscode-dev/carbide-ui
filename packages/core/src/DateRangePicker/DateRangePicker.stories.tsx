import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { matrix } from "../../../../.storybook/matrix.js";
import { DateRangePicker, type DateRangePickerProps } from "./DateRangePicker.js";

const FROM = new Date(2026, 8, 10);
const TO = new Date(2026, 8, 17);

function ControlledField(props: DateRangePickerProps) {
  const [value, setValue] = useState(props.value);
  return <DateRangePicker {...props} onValueChange={setValue} value={value} />;
}

const meta: Meta<typeof DateRangePicker> = {
  title: "Core/DateRangePicker",
  component: DateRangePicker,
  args: { label: "Reporting period" },
  argTypes: { onValueChange: { control: false } },
  render: (args) => <ControlledField {...args} />,
};
export default meta;

type Story = StoryObj<typeof DateRangePicker>;

export const Default: Story = {};

export const FromOnly: Story = { args: { value: { from: FROM, to: undefined } } };

export const BothSet: Story = { args: { value: { from: FROM, to: TO } } };

export const Invalid: Story = {
  args: { invalid: true, value: { from: TO, to: FROM } },
};

export const MinMax: Story = {
  args: { max: new Date(2026, 11, 10), min: FROM },
};

export const Matrix: Story = {
  decorators: [matrix],
  parameters: { layout: "fullscreen" },
  render: () => (
    <>
      <DateRangePicker label="Reporting period" />
      <DateRangePicker label="Reporting period" value={{ from: FROM, to: undefined }} />
      <DateRangePicker label="Reporting period" value={{ from: FROM, to: TO }} />
      <DateRangePicker invalid label="Reporting period" value={{ from: TO, to: FROM }} />
    </>
  ),
};
