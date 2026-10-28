import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { matrix } from "../../../../../.storybook/matrix.js";
import type { HomeNavGroup } from "./HomeNav.js";
import { HomeNav } from "./HomeNav.js";

function TilesIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="20" viewBox="0 0 16 16" width="20">
      <rect height="6" rx="1" stroke="currentcolor" width="6" x="1" y="1" />
      <rect height="6" rx="1" stroke="currentcolor" width="6" x="9" y="1" />
      <rect height="6" rx="1" stroke="currentcolor" width="6" x="1" y="9" />
      <rect height="6" rx="1" stroke="currentcolor" width="6" x="9" y="9" />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="20" viewBox="0 0 16 16" width="20">
      <path d="M2 14V6M8 14V2M14 14V9" stroke="currentcolor" strokeLinecap="round" />
    </svg>
  );
}

function GearIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="20" viewBox="0 0 16 16" width="20">
      <circle cx="8" cy="8" r="2.5" stroke="currentcolor" />
      <path
        d="M8 1v2M8 13v2M1 8h2M13 8h2M3 3l1.5 1.5M11.5 11.5L13 13M13 3l-1.5 1.5M4.5 11.5L3 13"
        stroke="currentcolor"
      />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="20" viewBox="0 0 16 16" width="20">
      <circle cx="8" cy="5" r="3" stroke="currentcolor" />
      <path d="M2 15c0-3 2.5-5 6-5s6 2 6 5" stroke="currentcolor" />
    </svg>
  );
}

function LogoPlaceholder() {
  return (
    <svg aria-hidden="true" fill="none" height="24" viewBox="0 0 24 24" width="24">
      <rect height="20" rx="4" stroke="currentcolor" width="20" x="2" y="2" />
      <path
        d="M8 16V8l4 8 4-8v8"
        stroke="currentcolor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const GROUPS: HomeNavGroup[] = [
  {
    label: "General",
    items: [
      { id: "overview", label: "Overview", icon: <TilesIcon /> },
      { id: "charts", label: "Charts", icon: <ChartIcon /> },
    ],
  },
  {
    label: "Administration",
    items: [
      { id: "users", label: "Users", icon: <UserIcon /> },
      { id: "settings", label: "Settings", icon: <GearIcon /> },
    ],
  },
];

function ControlledNavigation() {
  const [active, setActive] = useState("overview");
  return <HomeNav active={active} groups={GROUPS} onNavigate={setActive} />;
}

const meta: Meta<typeof HomeNav> = {
  title: "Home/Primitives/HomeNav",
  component: HomeNav,
  args: { groups: GROUPS, onNavigate: () => {} },
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof HomeNav>;

export const Default: Story = { render: () => <ControlledNavigation /> };

export const ActiveItem: Story = { args: { active: "settings" } };

export const OneGroup: Story = {
  args: { groups: [{ label: "General", items: GROUPS[0]?.items ?? [] }] },
};

export const WithLogo: Story = {
  args: { logo: <LogoPlaceholder /> },
};

export const WithLogout: Story = {
  args: { logo: <LogoPlaceholder />, onLogout: () => {} },
};

function LockIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="20" viewBox="0 0 16 16" width="20">
      <rect height="7" rx="1" stroke="currentcolor" width="10" x="3" y="7" />
      <path d="M5 7V5a3 3 0 0 1 6 0v2" stroke="currentcolor" strokeLinecap="round" />
    </svg>
  );
}

/** A footer action above logout: an encrypted area that is locked (warn tone). */
export const WithActions: Story = {
  args: {
    logo: <LogoPlaceholder />,
    actions: [
      { id: "vault", label: "Unlock vault", icon: <LockIcon />, onClick: () => {}, tone: "warn" },
    ],
    onLogout: () => {},
  },
};

export const ActionsWithoutLogout: Story = {
  args: {
    actions: [
      { id: "vault", label: "Lock vault", icon: <LockIcon />, onClick: () => {}, tone: "success" },
      {
        id: "maintenance",
        label: "Maintenance",
        icon: <GearIcon />,
        onClick: () => {},
        disabled: true,
      },
    ],
  },
};

const COLORED_GROUPS: HomeNavGroup[] = [
  {
    color: "blue",
    label: "Operations",
    items: [{ id: "dashboard", label: "Dashboard", icon: <TilesIcon /> }],
  },
  {
    color: "orange",
    label: "Environment",
    items: [{ id: "light", label: "Light", icon: <ChartIcon /> }],
  },
  {
    color: "green",
    label: "Care",
    items: [{ id: "plants", label: "Plants", icon: <UserIcon /> }],
  },
  {
    color: "yellow",
    label: "Energy",
    items: [{ id: "energy", label: "Energy", icon: <GearIcon /> }],
  },
  {
    color: "slate",
    label: "Administration",
    items: [{ id: "settings", label: "Settings", icon: <GearIcon /> }],
  },
];

export const Colored: Story = {
  args: { groups: COLORED_GROUPS },
};

export const Matrix: Story = {
  decorators: [matrix],
  parameters: { layout: "fullscreen" },
  args: { active: "settings", logo: <LogoPlaceholder />, onLogout: () => {} },
};
