import type { Meta, StoryObj } from "@storybook/react-vite";
import { matrix } from "../../../../.storybook/matrix.js";
import { Badge, type BadgeState } from "./Badge.js";

const meta: Meta<typeof Badge> = {
  title: "Core/Badge",
  component: Badge,
  args: { children: "New" },
};
export default meta;

type Story = StoryObj<typeof Badge>;

const STATES: readonly BadgeState[] = [
  "neutral",
  "accent",
  "success",
  "warn",
  "critical",
  "error",
  "manual",
];
const COUNTERS: readonly (readonly [BadgeState, number])[] = [
  ["neutral", 3],
  ["accent", 12],
  ["success", 1250],
  ["warn", 128],
  ["critical", 42],
  ["error", 99],
  ["manual", 0],
];

export const Default: Story = {};

export const Neutral: Story = { args: { state: "neutral" } };
export const Accent: Story = { args: { state: "accent" } };
export const Success: Story = { args: { state: "success", children: "OK" } };
export const Warn: Story = { args: { state: "warn", children: "Limit" } };
export const Critical: Story = { args: { state: "critical", children: "Critical" } };
export const ErrorState: Story = { name: "Error", args: { state: "error", children: "Fault" } };
export const Manual: Story = { args: { state: "manual", children: "Manual" } };

export const Count: Story = { args: { count: 3, children: undefined } };

export const LargeCount: Story = { args: { count: 1250, state: "error", children: undefined } };

export const Matrix: Story = {
  decorators: [matrix],
  parameters: { layout: "fullscreen" },
  render: () => (
    <>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--carbide-sp-3)" }}>
        {STATES.map((state) => (
          <Badge key={state} state={state}>
            {state}
          </Badge>
        ))}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--carbide-sp-3)" }}>
        {COUNTERS.map(([state, count]) => (
          <Badge count={count} key={state} state={state} />
        ))}
      </div>
    </>
  ),
};
