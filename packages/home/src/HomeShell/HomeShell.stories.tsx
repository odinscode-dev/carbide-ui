import { Button, Checkbox, Modal, Select, Tag, TextInput, Tile } from "@odinscode/carbide-core";
import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ComponentProps } from "react";
import { useState } from "react";
import type { HomeNavGroup } from "../primitives/HomeNav/index.js";
import { HomeShell } from "./HomeShell.js";

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
    items: [{ id: "settings", label: "Settings", icon: <GearIcon /> }],
  },
];

function ControlledHomeShell(
  props: Omit<ComponentProps<typeof HomeShell>, "activeNavItem" | "navGroups" | "onNavigate">,
) {
  const [active, setActive] = useState("overview");
  return <HomeShell {...props} activeNavItem={active} navGroups={GROUPS} onNavigate={setActive} />;
}

const meta: Meta<typeof HomeShell> = {
  title: "Home/HomeShell",
  component: HomeShell,
  parameters: { layout: "fullscreen" },
  render: (args) => (
    <ControlledHomeShell {...args}>
      <Tile>Temperature</Tile>
      <Tile>Humidity</Tile>
      <Tile>CO₂</Tile>
    </ControlledHomeShell>
  ),
};
export default meta;

type Story = StoryObj<typeof HomeShell>;

export const Default: Story = {};

export const Desktop: Story = {
  decorators: [(Story) => <div style={{ inlineSize: "1920px" }}>{Story()}</div>],
};

export const Tablet: Story = {
  decorators: [(Story) => <div style={{ inlineSize: "768px" }}>{Story()}</div>],
};

export const Smartphone: Story = {
  decorators: [(Story) => <div style={{ inlineSize: "412px" }}>{Story()}</div>],
};

export const WithLogoAndLogout: Story = {
  args: {
    logo: (
      <svg aria-hidden="true" fill="none" height="24" viewBox="0 0 24 24" width="24">
        <rect height="20" rx="4" stroke="currentcolor" width="20" x="2" y="2" />
        <path
          d="M8 16V8l4 8 4-8v8"
          stroke="currentcolor"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    onLogout: () => {},
  },
};

/** growdog's case: the encrypted area's lock sits above logout, locked in the warn tone. */
export const WithNavActions: Story = {
  args: {
    navActions: [
      {
        id: "vault",
        label: "Unlock vault",
        tone: "warn",
        onClick: () => {},
        icon: (
          <svg aria-hidden="true" fill="none" height="20" viewBox="0 0 16 16" width="20">
            <rect height="7" rx="1" stroke="currentcolor" width="10" x="3" y="7" />
            <path d="M5 7V5a3 3 0 0 1 6 0v2" stroke="currentcolor" strokeLinecap="round" />
          </svg>
        ),
      },
    ],
    onLogout: () => {},
  },
};

function SurfaceSample() {
  const [modal, setModal] = useState(false);
  const [checked, setChecked] = useState(true);
  const [name, setName] = useState("Tent 1");
  const [sort, setSort] = useState<string | null>("auto");
  return (
    <div
      style={{
        display: "grid",
        gap: "var(--carbide-sp-4)",
        gridTemplateColumns: "repeat(auto-fit, minmax(16rem, 1fr))",
        padding: "var(--carbide-sp-5)",
      }}
    >
      <Tile>
        <div style={{ display: "grid", gap: "var(--carbide-sp-4)" }}>
          <strong>Everything is fine</strong>
          <div style={{ display: "flex", gap: "var(--carbide-sp-3)" }}>
            <Tag state="success">In target range</Tag>
            <Tag>Night</Tag>
          </div>
          <div style={{ display: "flex", gap: "var(--carbide-sp-3)" }}>
            <Button variant="primary">Save</Button>
            <Button variant="secondary">Cancel</Button>
            <Button onClick={() => setModal(true)} variant="ghost">
              Open dialog
            </Button>
          </div>
        </div>
      </Tile>
      <Tile>
        <div style={{ display: "grid", gap: "var(--carbide-sp-4)" }}>
          <TextInput label="Name" onValueChange={setName} value={name} />
          <Select
            items={[
              { value: "auto", label: "Autoflower" },
              { value: "photo", label: "Photoperiodic" },
            ]}
            label="Kind"
            onValueChange={setSort}
            value={sort}
          />
          <Checkbox checked={checked} label="Remind me" onCheckedChange={setChecked} />
        </div>
      </Tile>
      <Modal
        footer={
          <>
            <Button onClick={() => setModal(false)} variant="secondary">
              Cancel
            </Button>
            <Button onClick={() => setModal(false)} variant="primary">
              Refilled
            </Button>
          </>
        }
        onOpenChange={setModal}
        open={modal}
        title="Refill the water tank"
      >
        The humidifier ran dry. Fill the tank, then confirm.
      </Modal>
    </div>
  );
}

const renderSurfaceSample: Story["render"] = (args) => (
  <ControlledHomeShell {...args}>
    <SurfaceSample />
  </ControlledHomeShell>
);

/**
 * The home surface: flat green-tinted ground, round cards (18 px), round
 * controls (12 px), no glass. Only growdog switches it on.
 */
export const SurfaceHomeLight: Story = {
  args: { surface: "home", theme: "light" },
  render: renderSurfaceSample,
};

/**
 * What an app does: no `theme` on the shell, the theme comes from the
 * document element (here the toolbar). Switch the toolbar to dark.
 */
export const SurfaceHome: Story = {
  args: { surface: "home" },
  render: renderSurfaceSample,
};

export const SurfaceHomeDark: Story = {
  args: { surface: "home", theme: "dark" },
  render: renderSurfaceSample,
};

/** The default stays exactly as before: same content, `surface` unset. */
export const SurfaceCarbon: Story = {
  args: { theme: "light" },
  render: renderSurfaceSample,
};
