import type { Meta, StoryObj } from "@storybook/react-vite";
import { Board } from "./Board.js";
import { BoardWidget } from "./BoardWidget.js";

const meta: Meta<typeof BoardWidget> = {
  title: "Shells/BoardWidget",
  component: BoardWidget,
  args: { x: 1, y: 1, w: 6, h: 8, children: "Flow" },
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <div style={{ overflow: "auto", inlineSize: "100%", blockSize: "12rem" }}>
        <Board>
          <Story />
        </Board>
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof BoardWidget>;

export const Default: Story = {};

export const Info: Story = { args: { state: "info" } };

export const Success: Story = { args: { state: "success" } };

export const Warn: Story = { args: { state: "warn" } };

export const Critical: Story = { args: { state: "critical" } };

export const ErrorState: Story = { args: { state: "error" } };
