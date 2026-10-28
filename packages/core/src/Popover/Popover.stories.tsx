import type { Meta, StoryObj } from "@storybook/react-vite";
import { useRef, useState } from "react";
import { matrix } from "../../../../.storybook/matrix.js";
import { Button } from "../Button/index.js";
import { Popover, type PopoverProps } from "./Popover.js";

function Framed({ open: defaultOpen = true, ...props }: PopoverProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div
      ref={frameRef}
      style={{
        position: "relative",
        display: "grid",
        justifyItems: "center",
        padding: "var(--carbide-sp-9)",
      }}
    >
      <Popover {...props} container={frameRef} onOpenChange={setOpen} open={open} />
    </div>
  );
}

const CONTENT = (
  <div style={{ display: "grid", gap: "var(--carbide-sp-3)" }}>
    <strong>Feed pump 1</strong>
    <span>Hand mode since 14:20. Last maintenance two days ago.</span>
  </div>
);

const meta: Meta<typeof Popover> = {
  title: "Core/Popover",
  component: Popover,
  args: { content: CONTENT, open: true, children: <Button>Pump 1</Button> },
  argTypes: { container: { control: false }, onOpenChange: { control: false } },
  render: (args) => <Framed {...args} />,
};
export default meta;

type Story = StoryObj<typeof Popover>;

export const Default: Story = {};

export const Top: Story = { args: { placement: "top" } };
export const Right: Story = { args: { placement: "right" } };
export const Bottom: Story = { args: { placement: "bottom" } };
export const Left: Story = { args: { placement: "left" } };

export const WithoutArrow: Story = { args: { arrow: false } };

export const WithBorderColor: Story = {
  args: { borderColor: "var(--carbide-signal-alarm)" },
};

export const WithBackground: Story = {
  args: { background: "var(--carbide-layer-2)" },
};

export const WithWidth: Story = {
  args: {
    width: "36rem",
    content: (
      <table style={{ inlineSize: "100%", borderCollapse: "collapse" }}>
        <tbody>
          {[
            ["08:14", "Pump 1 switched to manual", "Hall 2"],
            ["07:52", "Pressure line 2 near limit", "Hall 2"],
            ["06:30", "Backup completed", "System"],
          ].map(([time, event, where]) => (
            <tr key={time}>
              <td style={{ padding: "var(--carbide-sp-2) 0" }}>{time}</td>
              <td style={{ padding: "var(--carbide-sp-2) var(--carbide-sp-4)" }}>{event}</td>
              <td style={{ color: "var(--carbide-text-2)" }}>{where}</td>
            </tr>
          ))}
        </tbody>
      </table>
    ),
  },
};

export const WithoutAutoFocus: Story = {
  args: { autoFocus: false },
};

export const Closed: Story = { args: { open: false } };

export const WithControls: Story = {
  args: {
    content: (
      <div style={{ display: "grid", gap: "var(--carbide-sp-3)", justifyItems: "start" }}>
        <span>Stop feed pump 1?</span>
        <Button variant="danger">Stop</Button>
      </div>
    ),
  },
};

export const LongContent: Story = {
  args: {
    content:
      "Feed pump 1 of hall 2 runs in hand mode since the last maintenance window, reports no fault, and has been switched back to automatic twice today without a change in flow rate.",
  },
};

export const Matrix: Story = {
  decorators: [matrix],
  parameters: { layout: "fullscreen" },
  render: () => (
    <div style={{ display: "grid", gap: "var(--carbide-sp-6)", justifyItems: "stretch" }}>
      <Framed content="With arrow" placement="bottom">
        <Button>arrow</Button>
      </Framed>
      <Framed arrow={false} content="Without arrow" placement="bottom">
        <Button>plain</Button>
      </Framed>
    </div>
  ),
};
