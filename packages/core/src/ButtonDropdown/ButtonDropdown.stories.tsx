import type { Meta, StoryObj } from "@storybook/react-vite";
import { matrix } from "../../../../.storybook/matrix.js";
import { ButtonDropdown, type ButtonDropdownItem } from "./ButtonDropdown.js";

const ITEMS: ButtonDropdownItem[] = [
  { id: "start", label: "Start" },
  { id: "stop", label: "Stop" },
  { id: "restart", label: "Restart", group: "control" },
  { id: "reset", label: "Reset counters", group: "control" },
  { id: "export", label: "Export log", group: "data" },
  { id: "delete", label: "Delete log", group: "data", danger: true },
  { id: "locked", label: "Locked action", group: "data", disabled: true },
];

const meta: Meta<typeof ButtonDropdown> = {
  title: "Core/ButtonDropdown",
  component: ButtonDropdown,
  args: { label: "Actions", items: ITEMS },
  argTypes: { onItemSelect: { control: false }, onMainClick: { control: false } },
};
export default meta;

type Story = StoryObj<typeof ButtonDropdown>;

export const Default: Story = {};

export const Primary: Story = { args: { variant: "primary" } };
export const Ghost: Story = { args: { variant: "ghost" } };

export const Split: Story = { args: { split: true, label: "Start" } };

export const Disabled: Story = { args: { disabled: true } };

export const Matrix: Story = {
  decorators: [matrix],
  parameters: { layout: "fullscreen" },
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--carbide-sp-5)" }}>
      <ButtonDropdown items={ITEMS} label="Actions" />
      <ButtonDropdown items={ITEMS} label="Start" split variant="primary" />
      <ButtonDropdown disabled items={ITEMS} label="Actions" />
    </div>
  ),
};
