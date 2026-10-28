import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { userEvent, within } from "storybook/test";
import { matrix } from "../../../../.storybook/matrix.js";
import { Dropdown, type DropdownProps } from "./Dropdown.js";

const ITEMS = [
  { value: "auto", label: "Automatic" },
  { value: "manual", label: "Manual" },
  { value: "maintenance", label: "Maintenance" },
  { value: "off", label: "Off", disabled: true },
];

const MANY_ITEMS = Array.from({ length: 24 }, (_, index) => ({
  value: `line-${index + 1}`,
  label: `Line ${index + 1}`,
}));

function ControlledDropdown(props: DropdownProps) {
  const [value, setValue] = useState<string | null>(props.value ?? null);
  return <Dropdown {...props} onValueChange={setValue} value={value} />;
}

const meta: Meta<typeof Dropdown> = {
  title: "Core/Dropdown",
  component: Dropdown,
  args: { label: "Operating mode", items: ITEMS },
  argTypes: { onValueChange: { control: false }, filter: { control: false } },
  render: (args) => <ControlledDropdown {...args} />,
  decorators: [
    (Story) => (
      <div style={{ width: "18rem" }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof Dropdown>;

export const Default: Story = {};

export const Open: Story = {
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole("combobox"));
  },
};

export const Filtered: Story = {
  play: async ({ canvasElement }) => {
    await userEvent.type(within(canvasElement).getByRole("combobox"), "ma");
  },
};

export const NoMatches: Story = {
  play: async ({ canvasElement }) => {
    await userEvent.type(within(canvasElement).getByRole("combobox"), "xyz");
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
  args: { items: MANY_ITEMS, label: "Line" },
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole("combobox"));
  },
};

export const CustomFilter: Story = {
  args: {
    filter: (item, query) => item.label.toLowerCase().startsWith(query.toLowerCase()),
  },
  play: async ({ canvasElement }) => {
    await userEvent.type(within(canvasElement).getByRole("combobox"), "m");
  },
};

export const Matrix: Story = {
  decorators: [matrix],
  parameters: { layout: "fullscreen" },
  render: () => (
    <div style={{ display: "grid", gap: "var(--carbide-sp-5)", width: "14rem", maxWidth: "100%" }}>
      <Dropdown items={ITEMS} label="No selection" />
      <Dropdown items={ITEMS} label="With selection" value="manual" />
      <Dropdown invalid items={ITEMS} label="Invalid" />
      <Dropdown disabled items={ITEMS} label="Disabled" value="auto" />
    </div>
  ),
};
