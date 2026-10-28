import type { Meta, StoryObj } from "@storybook/react-vite";
import { Board } from "./Board.js";
import { BoardWidget } from "./BoardWidget.js";

function Measurement({ label, value, unit }: { label: string; value: string; unit: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--carbide-sp-2)" }}>
      <span style={{ color: "var(--carbide-text-2)", fontSize: "var(--carbide-fs-small)" }}>
        {label}
      </span>
      <span style={{ fontFamily: "var(--carbide-font-mono)", fontSize: "var(--carbide-fs-h1)" }}>
        {value}
        <span
          style={{ fontSize: "var(--carbide-fs-small)", marginInlineStart: "var(--carbide-sp-2)" }}
        >
          {unit}
        </span>
      </span>
    </div>
  );
}

const meta: Meta<typeof Board> = {
  title: "Shells/Board",
  component: Board,
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <div style={{ overflow: "auto", inlineSize: "100%", blockSize: "24rem" }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof Board>;

export const Default: Story = {
  render: () => (
    <Board>
      <BoardWidget h={5} state="success" w={6} x={1} y={1}>
        <Measurement label="Flow" unit="m³/h" value="42.3" />
      </BoardWidget>
      <BoardWidget h={5} state="warn" w={6} x={7} y={1}>
        <Measurement label="Pressure" unit="bar" value="6.8" />
      </BoardWidget>
      <BoardWidget h={5} state="error" w={6} x={13} y={1}>
        <Measurement label="Pump 1" unit="" value="Fault" />
      </BoardWidget>
    </Board>
  ),
};

export const Empty: Story = {
  render: () => <Board />,
};
