import type { Meta, StoryObj } from "@storybook/react-vite";
import { useRef, useState } from "react";
import { matrix } from "../../../../.storybook/matrix.js";
import { Button } from "../Button/index.js";
import { Dialog, type DialogProps, type DialogRole } from "./Dialog.js";

const ROLES: DialogRole[] = ["confirm", "info", "warning", "critical", "error"];

const MESSAGE = "Pump 1 will stop and the line drains. This cannot be undone.";

function ControlledDialog(props: DialogProps) {
  const [open, setOpen] = useState(props.open ?? true);
  return (
    <>
      <Button onClick={() => setOpen(true)} variant="secondary">
        Open
      </Button>
      <Dialog {...props} onOpenChange={setOpen} open={open} />
    </>
  );
}

function InFrame({ role }: { role: DialogRole }) {
  const frame = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={frame}
      style={{ position: "relative", width: "100%", height: "23rem", transform: "translateZ(0)" }}
    >
      <Dialog container={frame} message={MESSAGE} open role={role} title="Stop pump 1?" />
    </div>
  );
}

const meta: Meta<typeof Dialog> = {
  title: "Core/Dialog",
  component: Dialog,
  args: { open: true, title: "Stop pump 1?", message: MESSAGE },
  argTypes: { onOpenChange: { control: false }, onConfirm: { control: false } },
  render: (args) => <ControlledDialog {...args} />,
};
export default meta;

type Story = StoryObj<typeof Dialog>;

export const Default: Story = {};

export const Info: Story = {
  args: {
    role: "info",
    title: "Maintenance window",
    message: "Line A pauses at 22:00 for 30 minutes.",
  },
};

export const Warning: Story = {
  args: {
    role: "warning",
    title: "Threshold reached",
    message: "Tank 2 is at 92 % of its capacity.",
  },
};

export const Critical: Story = {
  args: {
    role: "critical",
    title: "Critical threshold reached",
    message: "Tank 2 is at 98 % of its capacity.",
  },
};

export const ErrorRole: Story = {
  name: "Error",
  args: {
    role: "error",
    title: "Connection lost",
    message: "The controller has not answered for 30 seconds.",
  },
};

export const Danger: Story = { args: { role: "warning", danger: true, confirmText: "Stop pump" } };

export const CustomTexts: Story = {
  args: { cancelText: "Keep running", confirmText: "Stop pump" },
};

export const LongMessage: Story = {
  args: {
    role: "warning",
    message: `${MESSAGE} ${MESSAGE} ${MESSAGE} ${MESSAGE} ${MESSAGE} ${MESSAGE}`,
  },
};

export const Matrix: Story = {
  decorators: [matrix],
  parameters: { layout: "fullscreen" },
  render: () => (
    <>
      {ROLES.map((role) => (
        <InFrame key={role} role={role} />
      ))}
    </>
  ),
};
