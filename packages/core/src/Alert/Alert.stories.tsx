import type { Meta, StoryObj } from "@storybook/react-vite";
import { matrix } from "../../../../.storybook/matrix.js";
import { Alert } from "./Alert.js";

const meta: Meta<typeof Alert> = {
  title: "Core/Alert",
  component: Alert,
  args: {
    title: "New firmware available",
    children: "Version 4.2.1 is ready to install on this line.",
  },
  argTypes: { action: { control: false } },
};
export default meta;

type Story = StoryObj<typeof Alert>;

export const Default: Story = {};

export const Success: Story = {
  args: { state: "success", title: "Recipe written", children: "Recipe 4711 written to PLC." },
};

export const Warn: Story = {
  args: {
    state: "warn",
    title: "Tank level nearing maximum",
    children: "Level is at 92 % of capacity.",
  },
};

export const Critical: Story = {
  args: {
    state: "critical",
    title: "Pressure close to shutoff valve",
    children: "Reduce flow rate to avoid an automatic shutdown.",
  },
};

export const Failed: Story = {
  args: { state: "error", title: "PLC did not answer", children: "Last successful contact 14:20." },
};

export const WithoutTitle: Story = {
  args: { title: undefined, children: "Version 4.2.1 is ready to install on this line." },
};

export const WithAction: Story = {
  args: {
    state: "critical",
    title: "Pressure close to shutoff valve",
    children: "Reduce flow rate to avoid an automatic shutdown.",
    action: { label: "Reduce now", onClick: () => undefined },
  },
};

export const LongMessage: Story = {
  args: {
    children:
      "Feed pump 1 of hall 2 runs in hand mode since the last maintenance window, reports no fault, and has been switched back to automatic twice today without a change in flow rate.",
    action: { label: "View details", onClick: () => undefined },
  },
};

const STATES = ["info", "success", "warn", "critical", "error"] as const;

export const Matrix: Story = {
  decorators: [matrix],
  parameters: { layout: "fullscreen" },
  render: () => (
    <div style={{ display: "grid", gap: "var(--carbide-sp-3)" }}>
      {STATES.map((state) => (
        <Alert key={state} state={state} title={`${state} alert`}>
          Level is at 92 % of capacity.
        </Alert>
      ))}
      <Alert title={undefined}>Without a title, children carry the message alone.</Alert>
      <Alert action={{ label: "Reduce now", onClick: () => undefined }} title="With an action">
        This one asks for a reaction.
      </Alert>
    </div>
  ),
};
