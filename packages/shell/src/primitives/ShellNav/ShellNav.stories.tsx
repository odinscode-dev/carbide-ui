import { seriesColor } from "@odinscode/carbide-core";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { matrix } from "../../../../../.storybook/matrix.js";
import type { ShellNavGroup } from "./ShellNav.js";
import { ShellNav } from "./ShellNav.js";

function TilesIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="16" viewBox="0 0 16 16" width="16">
      <rect height="6" rx="1" stroke="currentcolor" width="6" x="1" y="1" />
      <rect height="6" rx="1" stroke="currentcolor" width="6" x="9" y="1" />
      <rect height="6" rx="1" stroke="currentcolor" width="6" x="1" y="9" />
      <rect height="6" rx="1" stroke="currentcolor" width="6" x="9" y="9" />
    </svg>
  );
}

function GearIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="16" viewBox="0 0 16 16" width="16">
      <circle cx="8" cy="8" r="2.5" stroke="currentcolor" />
      <path
        d="M8 1v2M8 13v2M1 8h2M13 8h2M3 3l1.5 1.5M11.5 11.5L13 13M13 3l-1.5 1.5M4.5 11.5L3 13"
        stroke="currentcolor"
      />
    </svg>
  );
}

const GROUPS: ShellNavGroup[] = [
  {
    items: [
      { id: "overview", label: "Overview", icon: <TilesIcon /> },
      { id: "assets", label: "Assets" },
    ],
  },
  {
    label: "Administration",
    items: [
      { id: "users", label: "Users" },
      { id: "settings", label: "Settings", icon: <GearIcon /> },
    ],
  },
];

function ControlledNavigation() {
  const [active, setActive] = useState("overview");
  return <ShellNav active={active} groups={GROUPS} onNavigate={setActive} />;
}

const meta: Meta<typeof ShellNav> = {
  title: "Shells/Primitives/ShellNav",
  component: ShellNav,
  args: { groups: GROUPS, onNavigate: () => {} },
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof ShellNav>;

export const Default: Story = { render: () => <ControlledNavigation /> };

export const ActiveItem: Story = { args: { active: "settings" } };

export const WithoutGroupLabels: Story = {
  args: { groups: [{ items: GROUPS[0]?.items ?? [] }] },
};

export const LongLabel: Story = {
  args: {
    groups: [
      {
        items: [{ id: "long", label: "Wastewater treatment sensor cluster north configuration" }],
      },
    ],
  },
};

export const Matrix: Story = {
  decorators: [matrix],
  parameters: { layout: "fullscreen" },
  args: { active: "settings" },
};

const GRID_GROUPS: ShellNavGroup[] = [
  {
    label: "Monitoring",
    accent: seriesColor(1),
    items: [
      {
        id: "overview",
        label: "Overview",
        description: "Plant-wide status",
        icon: <TilesIcon />,
      },
      { id: "assets", label: "Assets", description: "Equipment inventory" },
      { id: "alarms", label: "Alarms", description: "Active and acknowledged" },
      { id: "trends", label: "Trends", description: "Historical measurements" },
    ],
  },
  {
    label: "Administration",
    accent: seriesColor(4),
    items: [
      {
        id: "settings",
        label: "Settings",
        description: "Board and alert setup",
        icon: <GearIcon />,
      },
      { id: "users", label: "Users", description: "Accounts and roles" },
    ],
  },
];

function GridLogo() {
  return (
    <span style={{ fontFamily: "var(--carbide-font-display)", fontWeight: 600 }}>Plant 3</span>
  );
}

function ControlledGrid() {
  const [active, setActive] = useState("overview");
  return (
    <ShellNav
      active={active}
      groups={GRID_GROUPS}
      layout="grid"
      logo={<GridLogo />}
      onNavigate={setActive}
    />
  );
}

export const GridLayout: Story = {
  render: () => (
    <div style={{ inlineSize: "480px", blockSize: "560px", display: "flex" }}>
      <ControlledGrid />
    </div>
  ),
};
