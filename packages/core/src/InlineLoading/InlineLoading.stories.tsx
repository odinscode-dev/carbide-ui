import type { Meta, StoryObj } from "@storybook/react-vite";
import { matrix } from "../../../../.storybook/matrix.js";
import { InlineLoading } from "./InlineLoading.js";

const meta: Meta<typeof InlineLoading> = {
  title: "Core/InlineLoading",
  component: InlineLoading,
  args: { status: "active", description: "Writing recipe to PLC" },
};
export default meta;

type Story = StoryObj<typeof InlineLoading>;

export const Default: Story = {};

export const Active: Story = { args: { status: "active" } };

export const Finished: Story = { args: { status: "finished", description: "Recipe written" } };

export const Failed: Story = { args: { status: "error", description: "PLC did not answer" } };

export const WithoutText: Story = { args: { description: undefined } };

export const LongText: Story = {
  args: {
    description: "Writing recipe 4711 to PLC of hall 2, line A -- this can take up to two minutes",
  },
};

export const Matrix: Story = {
  decorators: [matrix],
  parameters: { layout: "fullscreen" },
  render: () => (
    <div style={{ display: "grid", gap: "var(--carbide-sp-3)", justifyItems: "start" }}>
      <InlineLoading description="Writing" status="active" />
      <InlineLoading description="Written" status="finished" />
      <InlineLoading description="Failed" status="error" />
      <InlineLoading status="active" />
    </div>
  ),
};
