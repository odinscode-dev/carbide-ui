import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { matrix } from "../../../../.storybook/matrix.js";
import { DatePicker, type DatePickerProps } from "./DatePicker.js";

const TODAY = new Date(2026, 8, 10);

function ControlledField(props: DatePickerProps) {
  const [value, setValue] = useState(props.value);
  return (
    <DatePicker {...props} onValueChange={(date) => setValue(date ?? undefined)} value={value} />
  );
}

const meta: Meta<typeof DatePicker> = {
  title: "Core/DatePicker",
  component: DatePicker,
  args: { label: "Maintenance date" },
  argTypes: { onValueChange: { control: false } },
  render: (args) => <ControlledField {...args} />,
};
export default meta;

type Story = StoryObj<typeof DatePicker>;

export const Default: Story = {};

export const WithValue: Story = { args: { value: TODAY } };

export const German: Story = { args: { locale: "de-DE", value: TODAY } };

export const CustomPlaceholder: Story = {
  args: { locale: "de-DE", placeholder: "Tag.Monat.Jahr" },
};

export const Invalid: Story = { args: { invalid: true, value: TODAY } };

export const Disabled: Story = { args: { disabled: true, value: TODAY } };

export const MinMax: Story = {
  args: { min: TODAY, max: new Date(2026, 11, 10) },
};

export const Matrix: Story = {
  decorators: [matrix],
  parameters: { layout: "fullscreen" },
  render: () => (
    <>
      <DatePicker label="Maintenance date" />
      <DatePicker label="Maintenance date" value={TODAY} />
      <DatePicker invalid label="Maintenance date" value={TODAY} />
      <DatePicker disabled label="Maintenance date" value={TODAY} />
    </>
  ),
};
