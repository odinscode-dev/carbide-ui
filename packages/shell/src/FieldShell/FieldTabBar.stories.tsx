import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { type FieldTab, FieldTabBar } from "./FieldTabBar.js";

const TABS: readonly FieldTab[] = [
  { id: "monitoring", label: "Monitoring", icon: <span aria-hidden="true">M</span> },
  { id: "worklog", label: "Work log", icon: <span aria-hidden="true">W</span> },
  { id: "alarms", label: "Alarms", icon: <span aria-hidden="true">A</span> },
];

function Interactive() {
  const [active, setActive] = useState("monitoring");
  return <FieldTabBar active={active} onChange={setActive} tabs={TABS} />;
}

const meta: Meta<typeof FieldTabBar> = {
  title: "Shells/FieldTabBar",
  component: FieldTabBar,
};
export default meta;

type Story = StoryObj<typeof FieldTabBar>;

export const Default: Story = {
  render: () => <Interactive />,
};

export const Alarms: Story = {
  args: { active: "alarms", onChange: () => {}, tabs: TABS },
};
