import type { Meta, StoryObj } from "@storybook/react-vite";
import { matrix } from "../../../../.storybook/matrix.js";
import { Button } from "../Button/index.js";
import { Toaster, ToastIcon, type ToastState, toast } from "./Toast.js";
import styles from "./Toast.module.css";

function Trigger({
  label,
  state,
  action,
}: {
  label: string;
  state?: ToastState;
  action?: boolean;
}) {
  return (
    <>
      <Button
        onClick={() =>
          toast(label, {
            state,
            action: action ? { label: "Undo", onClick: () => undefined } : undefined,
          })
        }
      >
        Show toast
      </Button>
      <Toaster />
    </>
  );
}

const meta: Meta<typeof Toaster> = {
  title: "Core/Toast",
  component: Toaster,
};
export default meta;

type Story = StoryObj<typeof Toaster>;

export const Default: Story = { render: () => <Trigger label="Recipe written to PLC" /> };

export const Info: Story = {
  render: () => <Trigger label="New firmware available" state="info" />,
};

export const Success: Story = {
  render: () => <Trigger label="Recipe written" state="success" />,
};

export const Warn: Story = {
  render: () => <Trigger label="Tank level nearing maximum" state="warn" />,
};

export const Critical: Story = {
  render: () => <Trigger label="Pressure close to shutoff valve" state="critical" />,
};

export const Failed: Story = {
  render: () => <Trigger label="PLC did not answer" state="error" />,
};

export const WithAction: Story = {
  render: () => <Trigger action label="Recipe 4711 deleted" state="warn" />,
};

export const LongMessage: Story = {
  render: () => (
    <Trigger
      label="Feed pump 1 of hall 2 switched back to automatic after two minutes in hand mode"
      state="info"
    />
  ),
};

const STATES = ["info", "success", "warn", "critical", "error"] as const;

const EXAMPLE_TEXT: Record<ToastState, string> = {
  info: "New firmware available",
  success: "Recipe written",
  warn: "Tank level nearing maximum",
  critical: "Pressure close to shutoff valve",
  error: "PLC did not answer",
};

export const Matrix: Story = {
  decorators: [matrix],
  parameters: { layout: "fullscreen" },
  render: () => (
    <div style={{ display: "grid", gap: "var(--carbide-sp-3)", justifyItems: "stretch" }}>
      {STATES.map((state) => (
        <div className={styles.root} data-state={state} key={state}>
          <span aria-hidden="true" className={styles.icon}>
            <ToastIcon state={state} />
          </span>
          <p className={styles.title}>{EXAMPLE_TEXT[state]}</p>
        </div>
      ))}
    </div>
  ),
};
