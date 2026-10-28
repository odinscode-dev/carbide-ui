import { Tile } from "@odinscode/carbide-core";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { matrix } from "../../../../../.storybook/matrix.js";
import { ShellMain } from "./ShellMain.js";

const meta: Meta<typeof ShellMain> = {
  title: "Shells/Primitives/ShellMain",
  component: ShellMain,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof ShellMain>;

export const Default: Story = {
  render: () => (
    <div style={{ blockSize: "24rem" }}>
      <ShellMain>
        <Tile>Overview</Tile>
        <Tile>Assets</Tile>
      </ShellMain>
    </div>
  ),
};

export const LongContent: Story = {
  render: () => (
    <div style={{ blockSize: "24rem" }}>
      <ShellMain>
        {Array.from({ length: 20 }, (_, index) => `Section ${index + 1}`).map((section) => (
          <Tile key={section}>{section}</Tile>
        ))}
      </ShellMain>
    </div>
  ),
};

export const Matrix: Story = {
  decorators: [matrix],
  parameters: { layout: "fullscreen" },
  render: () => (
    <div style={{ blockSize: "16rem", inlineSize: "20rem" }}>
      <ShellMain>
        <Tile>Overview</Tile>
      </ShellMain>
    </div>
  ),
};

export const Fill: Story = {
  render: () => (
    <div style={{ blockSize: "24rem" }}>
      <ShellMain layout="fill">
        <Tile style={{ flex: "1 1 auto" }}>Takes the full height of the main area</Tile>
      </ShellMain>
    </div>
  ),
};
