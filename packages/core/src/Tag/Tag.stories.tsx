import type { Meta, StoryObj } from "@storybook/react-vite";
import { matrix } from "../../../../.storybook/matrix.js";
import { Tag, type TagState } from "./Tag.js";

const meta: Meta<typeof Tag> = {
  title: "Core/Tag",
  component: Tag,
  args: { children: "Pump 3" },
  argTypes: { onRemove: { control: false } },
};
export default meta;

type Story = StoryObj<typeof Tag>;

const STATES: readonly TagState[] = [
  "neutral",
  "accent",
  "success",
  "warn",
  "critical",
  "error",
  "manual",
];

export const Default: Story = {};

export const Neutral: Story = { args: { state: "neutral" } };
export const Accent: Story = { args: { state: "accent", children: "Selected" } };
export const Success: Story = { args: { state: "success", children: "Running" } };
export const Warn: Story = { args: { state: "warn", children: "Limit near" } };
export const Critical: Story = { args: { state: "critical", children: "Over limit" } };
export const ErrorState: Story = { name: "Error", args: { state: "error", children: "Fault" } };
export const Manual: Story = { args: { state: "manual", children: "Manual" } };

export const Removable: Story = {
  args: { children: "Filter: Hall 2", onRemove: () => undefined },
};

export const LongText: Story = {
  args: { children: "A tag with a label far longer than any tag should ever carry" },
};

export const Matrix: Story = {
  decorators: [matrix],
  parameters: { layout: "fullscreen" },
  render: () => (
    <>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--carbide-sp-3)" }}>
        {STATES.map((state) => (
          <Tag key={state} state={state}>
            {state}
          </Tag>
        ))}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--carbide-sp-3)" }}>
        {STATES.map((state) => (
          <Tag key={state} onRemove={() => undefined} state={state}>
            {state}
          </Tag>
        ))}
      </div>
    </>
  ),
};
