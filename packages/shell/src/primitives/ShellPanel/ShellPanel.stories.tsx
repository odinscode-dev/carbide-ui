import type { Meta, StoryObj } from "@storybook/react-vite";
import { matrix } from "../../../../../.storybook/matrix.js";
import { ShellPanel } from "./ShellPanel.js";

const meta: Meta<typeof ShellPanel> = {
  title: "Shells/Primitives/ShellPanel",
  component: ShellPanel,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof ShellPanel>;

export const Default: Story = {
  render: () => (
    <div style={{ blockSize: "24rem", inlineSize: "20rem" }}>
      <ShellPanel>
        <strong>Details</strong>
        <p>Select a row to see its details here.</p>
      </ShellPanel>
    </div>
  ),
};

export const CustomLabel: Story = {
  render: () => (
    <div style={{ blockSize: "16rem", inlineSize: "20rem" }}>
      <ShellPanel label="Help">Documentation and shortcuts.</ShellPanel>
    </div>
  ),
};

export const Matrix: Story = {
  decorators: [matrix],
  parameters: { layout: "fullscreen" },
  render: () => (
    <div style={{ blockSize: "16rem", inlineSize: "20rem" }}>
      <ShellPanel>
        <strong>Details</strong>
        <p>Select a row to see its details here.</p>
      </ShellPanel>
    </div>
  ),
};
