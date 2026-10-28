import type { Meta, StoryObj } from "@storybook/react-vite";
import { matrix } from "../../../../.storybook/matrix.js";
import { List } from "./List.js";

const meta: Meta<typeof List> = {
  title: "Core/List",
  component: List,
};
export default meta;

type Story = StoryObj<typeof List>;

export const Default: Story = {
  render: (args) => (
    <List {...args}>
      <li>Pump P-1</li>
      <li>Pump P-2</li>
      <li>Pump P-3</li>
    </List>
  ),
};

export const Ordered: Story = {
  args: { ordered: true },
  render: (args) => (
    <List {...args}>
      <li>Open the valve</li>
      <li>Wait for the pressure to settle</li>
      <li>Start the pump</li>
    </List>
  ),
};

export const Unordered: Story = { ...Default };

export const Nested: Story = {
  args: {
    items: [
      { content: "Plants" },
      {
        content: "Plant North",
        items: [
          { content: "Hall 1" },
          {
            content: "Hall 2",
            items: [{ content: "Line 4" }, { content: "Line 5" }],
          },
        ],
      },
      { content: "Plant South" },
    ],
  },
};

export const LongItem: Story = {
  render: (args) => (
    <div style={{ width: "16rem" }}>
      <List {...args}>
        <li>Drive shaft alignment tolerance exceeded on conveyor motor M-12</li>
      </List>
    </div>
  ),
};

export const Matrix: Story = {
  decorators: [matrix],
  parameters: { layout: "fullscreen" },
  render: () => (
    <div style={{ display: "grid", gap: "var(--carbide-sp-5)" }}>
      <List>
        <li>Pump P-1</li>
        <li>Pump P-2</li>
      </List>
      <List ordered>
        <li>Open the valve</li>
        <li>Start the pump</li>
      </List>
      <List
        items={[
          { content: "Plants" },
          { content: "Plant North", items: [{ content: "Hall 1" }, { content: "Hall 2" }] },
        ]}
      />
    </div>
  ),
};
