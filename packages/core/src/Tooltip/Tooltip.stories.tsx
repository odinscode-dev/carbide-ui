import type { Meta, StoryObj } from "@storybook/react-vite";
import { useRef } from "react";
import { matrix } from "../../../../.storybook/matrix.js";
import { Button } from "../Button/index.js";
import { Tooltip, type TooltipProps } from "./Tooltip.js";

function InFrame(props: TooltipProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={frameRef}
      style={{
        position: "relative",
        display: "grid",
        justifyItems: "center",
        padding: "var(--carbide-sp-8)",
      }}
    >
      <Tooltip {...props} container={frameRef} />
    </div>
  );
}

const meta: Meta<typeof Tooltip> = {
  title: "Core/Tooltip",
  component: Tooltip,
  args: {
    content: "Feed pump 1 of hall 2",
    defaultOpen: true,
    children: <Button>Pump 1</Button>,
  },
  argTypes: { container: { control: false } },
  render: (args) => <InFrame {...args} />,
};
export default meta;

type Story = StoryObj<typeof Tooltip>;

export const Default: Story = {};

export const Top: Story = { args: { placement: "top" } };
export const Right: Story = { args: { placement: "right" } };
export const Bottom: Story = { args: { placement: "bottom" } };
export const Left: Story = { args: { placement: "left" } };

export const Closed: Story = { args: { defaultOpen: false } };

export const LongText: Story = {
  args: {
    content:
      "Feed pump 1 of hall 2 runs in hand mode since the last maintenance window and reports no fault.",
  },
};

export const Matrix: Story = {
  decorators: [matrix],
  parameters: { layout: "fullscreen" },
  render: () => (
    <div style={{ display: "grid", gap: "var(--carbide-sp-6)", justifyItems: "stretch" }}>
      <InFrame content="Above" defaultOpen placement="top">
        <Button>top</Button>
      </InFrame>
      <InFrame content="Below" defaultOpen placement="bottom">
        <Button>bottom</Button>
      </InFrame>
    </div>
  ),
};
