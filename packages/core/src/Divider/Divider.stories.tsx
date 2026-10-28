import type { Meta, StoryObj } from "@storybook/react-vite";
import { matrix } from "../../../../.storybook/matrix.js";
import { Divider } from "./Divider.js";

const meta: Meta<typeof Divider> = {
  title: "Core/Divider",
  component: Divider,
};
export default meta;

type Story = StoryObj<typeof Divider>;

const ROW = { display: "flex", alignItems: "center", gap: "var(--carbide-sp-4)" } as const;

export const Default: Story = {
  render: (args) => (
    <div style={{ display: "grid", gap: "var(--carbide-sp-4)", width: "20rem" }}>
      <span>Above</span>
      <Divider {...args} />
      <span>Below</span>
    </div>
  ),
};

export const Horizontal: Story = { ...Default, args: { orientation: "horizontal" } };

export const Vertical: Story = {
  args: { orientation: "vertical" },
  render: (args) => (
    <div style={ROW}>
      <span>Left</span>
      <Divider {...args} />
      <span>Right</span>
    </div>
  ),
};

export const ErrorVariant: Story = {
  name: "Error",
  args: { variant: "error" },
  render: (args) => (
    <div style={{ display: "grid", gap: "var(--carbide-sp-4)", width: "20rem" }}>
      <span>Above</span>
      <Divider {...args} />
      <span>Error section</span>
    </div>
  ),
};

export const Warning: Story = {
  args: { variant: "warning" },
  render: (args) => (
    <div style={{ display: "grid", gap: "var(--carbide-sp-4)", width: "20rem" }}>
      <span>Above</span>
      <Divider {...args} />
      <span>Warning section</span>
    </div>
  ),
};

export const Success: Story = {
  args: { variant: "success" },
  render: (args) => (
    <div style={{ display: "grid", gap: "var(--carbide-sp-4)", width: "20rem" }}>
      <span>Above</span>
      <Divider {...args} />
      <span>Success section</span>
    </div>
  ),
};

export const Matrix: Story = {
  decorators: [matrix],
  parameters: { layout: "fullscreen" },
  render: () => (
    <>
      <div style={{ display: "grid", gap: "var(--carbide-sp-4)", width: "12rem" }}>
        <span>Above</span>
        <Divider />
        <span>Below</span>
      </div>
      <div style={ROW}>
        <span>Left</span>
        <Divider orientation="vertical" />
        <span>Right</span>
      </div>
    </>
  ),
};
