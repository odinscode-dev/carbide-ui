import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { userEvent, within } from "storybook/test";
import { matrix } from "../../../../.storybook/matrix.js";
import { Select, type SelectProps } from "./Select.js";

const ITEMS = [
  { value: "auto", label: "Automatic" },
  { value: "manual", label: "Manual" },
  { value: "maintenance", label: "Maintenance" },
  { value: "off", label: "Off", disabled: true },
];

const MANY = Array.from({ length: 24 }, (_, index) => ({
  value: `line-${index + 1}`,
  label: `Line ${index + 1}`,
}));

function ControlledSelect(props: SelectProps) {
  const [value, setValue] = useState<string | null>(props.value ?? null);
  return <Select {...props} onValueChange={setValue} value={value} />;
}

const meta: Meta<typeof Select> = {
  title: "Core/Select",
  component: Select,
  args: { label: "Operating mode", items: ITEMS },
  argTypes: { onValueChange: { control: false } },
  render: (args) => <ControlledSelect {...args} />,
  decorators: [
    (Story) => (
      <div style={{ width: "18rem" }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof Select>;

export const Default: Story = {};

export const Open: Story = {
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole("combobox"));
  },
};

export const WithSelection: Story = { args: { value: "manual" } };

export const Invalid: Story = { args: { invalid: true } };

export const Disabled: Story = { args: { disabled: true, value: "auto" } };

export const Empty: Story = {
  args: { items: [] },
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole("combobox"));
  },
};

export const ManyItems: Story = {
  args: { items: MANY, label: "Line" },
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole("combobox"));
  },
};

export const Groups: Story = {
  args: {
    items: [
      { value: "auto", label: "Automatic" },
      { value: "manual", label: "Manual" },
      { divider: true },
      { value: "maintenance", label: "Maintenance" },
      { divider: true, variant: "warning" },
      { value: "off", label: "Off" },
    ],
    label: "Operating mode",
  },
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole("combobox"));
  },
};

export const LongLabel: Story = {
  args: {
    items: [
      { value: "a", label: "Automatic operation following the schedule of the whole district" },
      ...ITEMS,
    ],
    value: "a",
  },
};

export const Matrix: Story = {
  decorators: [matrix],
  parameters: { layout: "fullscreen" },
  render: () => (
    <div style={{ display: "grid", gap: "var(--carbide-sp-5)", width: "14rem", maxWidth: "100%" }}>
      <Select items={ITEMS} label="No selection" />
      <Select items={ITEMS} label="With selection" value="manual" />
      <Select invalid items={ITEMS} label="Invalid" />
      <Select disabled items={ITEMS} label="Disabled" value="auto" />
      <Select items={[]} label="Empty" />
    </div>
  ),
};
