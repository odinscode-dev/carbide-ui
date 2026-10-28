import { Tile } from "@odinscode/carbide-core";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { FieldShell } from "./FieldShell.js";
import type { FieldTab } from "./FieldTabBar.js";

function MonitorIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="24" viewBox="0 0 24 24" width="24">
      <rect height="12" rx="1" stroke="currentcolor" strokeWidth="1.5" width="18" x="3" y="4" />
      <path d="M8 20h8M12 16v4" stroke="currentcolor" strokeLinecap="round" strokeWidth="1.5" />
    </svg>
  );
}

function WorklogIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="24" viewBox="0 0 24 24" width="24">
      <path
        d="M9 4h6l1 2h3v14H5V6h3l1-2Z"
        stroke="currentcolor"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path d="M9 12h6M9 16h6" stroke="currentcolor" strokeLinecap="round" strokeWidth="1.5" />
    </svg>
  );
}

function AlarmsIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="24" viewBox="0 0 24 24" width="24">
      <path
        d="M12 3 2 20h20L12 3Z"
        stroke="currentcolor"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path d="M12 10v4" stroke="currentcolor" strokeLinecap="round" strokeWidth="1.5" />
      <circle cx="12" cy="17" fill="currentcolor" r="0.75" />
    </svg>
  );
}

const TABS: FieldTab[] = [
  { id: "monitoring", label: "Monitoring", icon: <MonitorIcon /> },
  { id: "worklog", label: "Work log", icon: <WorklogIcon /> },
  { id: "alarms", label: "Alarms", icon: <AlarmsIcon /> },
];

const SECTIONS: Record<string, React.ReactNode> = {
  monitoring: (
    <>
      <Tile>
        <strong>Flow</strong>
        <div>42.3 m³/h</div>
      </Tile>
      <Tile>
        <strong>Pressure</strong>
        <div>6.8 bar</div>
      </Tile>
      <Tile>
        <strong>Temperature</strong>
        <div>18.4 °C</div>
      </Tile>
      <Tile>
        <strong>Pump 1</strong>
        <div>Running</div>
      </Tile>
    </>
  ),
  worklog: (
    <>
      <Tile clickable>Start shift</Tile>
      <Tile clickable>Log a task</Tile>
      <Tile clickable>End shift</Tile>
    </>
  ),
  alarms: (
    <>
      <Tile>Pressure line 2 near limit</Tile>
      <Tile>Pump 1 switched to manual</Tile>
    </>
  ),
};

function ControlledFieldShell(args: Parameters<typeof FieldShell>[0]) {
  const [active, setActive] = useState("monitoring");
  return (
    <FieldShell {...args} activeTab={active} onTabChange={setActive} tabs={TABS}>
      {SECTIONS[active]}
    </FieldShell>
  );
}

const meta: Meta<typeof FieldShell> = {
  title: "Shells/FieldShell",
  component: FieldShell,
  args: { title: "Plant 3" },
  parameters: { layout: "fullscreen" },
  render: (args) => <ControlledFieldShell {...args} />,
};
export default meta;

type Story = StoryObj<typeof FieldShell>;

export const Default: Story = {};

export const WithContextAndActions: Story = {
  args: { context: "Line 2 · shift 2" },
};
