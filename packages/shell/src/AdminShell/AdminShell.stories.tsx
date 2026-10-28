import { DataGrid, type DataGridColumn, Tile } from "@odinscode/carbide-core";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import type { ShellNavGroup } from "../primitives/ShellNav/index.js";
import { AdminShell } from "./AdminShell.js";

interface Charge {
  id: string;
  batch: string;
  cultivar: string;
  room: string;
  plants: number;
}

const BATCHES: Charge[] = [
  { id: "1", batch: "B-00001", cultivar: "Aurora", room: "Hall 1", plants: 240 },
  { id: "2", batch: "B-00002", cultivar: "Borealis", room: "Hall 2", plants: 180 },
  { id: "3", batch: "B-00003", cultivar: "Cascade", room: "Nursery", plants: 96 },
];

const COLUMNS: DataGridColumn<Charge>[] = [
  { accessorKey: "batch", header: "Batch", id: "batch", width: "7rem" },
  { accessorKey: "cultivar", header: "Cultivar", id: "cultivar" },
  { accessorKey: "room", header: "Room", id: "room" },
  { accessorKey: "plants", header: "Plants", id: "plants", type: "number", width: "6rem" },
];

const NAV_GROUPS: ShellNavGroup[] = [
  {
    items: [
      { id: "overview", label: "Overview" },
      { id: "batches", label: "Batches" },
      { id: "rooms", label: "Rooms" },
    ],
  },
  { label: "Administration", items: [{ id: "settings", label: "Settings" }] },
];

function ControlledAdminShell(args: Parameters<typeof AdminShell>[0]) {
  const [active, setActive] = useState("overview");
  return (
    <AdminShell {...args} activeNavItem={active} navGroups={NAV_GROUPS} onNavigate={setActive}>
      <Tile>
        <strong>240</strong> plants across 3 active batches
      </Tile>
      <DataGrid columns={COLUMNS} rows={BATCHES} />
    </AdminShell>
  );
}

const meta: Meta<typeof AdminShell> = {
  title: "Shells/AdminShell",
  component: AdminShell,
  args: { title: "Plant 3" },
  parameters: { layout: "fullscreen" },
  render: (args) => <ControlledAdminShell {...args} />,
};
export default meta;

type Story = StoryObj<typeof AdminShell>;

export const Default: Story = {
  args: { panel: <p>Select a row to see its details here.</p> },
};

export const WithoutPanel: Story = {};

export const WithContextAndActions: Story = {
  args: {
    context: "Site 12 · updated 2 minutes ago",
    panel: <p>Select a row to see its details here.</p>,
  },
};

function StatusStrip() {
  const entries: [string, string][] = [
    ["Awaiting approval", "3 batches"],
    ["Expiring", "2 permits in 30 days"],
  ];
  return (
    <div style={{ display: "flex", gap: "var(--carbide-sp-6)" }}>
      {entries.map(([label, value]) => (
        <div key={label} style={{ display: "flex", flexDirection: "column" }}>
          <span
            style={{
              color: "var(--carbide-text-2)",
              fontSize: "var(--carbide-fs-label)",
              textTransform: "uppercase",
            }}
          >
            {label}
          </span>
          <span style={{ fontWeight: 600, whiteSpace: "nowrap" }}>{value}</span>
        </div>
      ))}
    </div>
  );
}

function NavLogo() {
  return (
    <span style={{ fontFamily: "var(--carbide-font-display)", fontWeight: 600 }}>Plant 3</span>
  );
}

const NAV_FOOTER_GROUPS: ShellNavGroup[] = [
  {
    items: [
      { id: "language", label: "Language" },
      { id: "sign-out", label: "Sign out" },
    ],
  },
];

export const WithStatus: Story = {
  args: { context: "Site 12 · updated 2 minutes ago", status: <StatusStrip /> },
};

export const WithNavLogoAndFooter: Story = {
  args: { navFooterGroups: NAV_FOOTER_GROUPS, navLogo: <NavLogo /> },
};

export const FillLayout: Story = {
  args: { mainLayout: "fill", panel: <p>Select a row to see its details here.</p> },
  render: (args) => (
    <AdminShell {...args} navGroups={NAV_GROUPS} onNavigate={() => {}}>
      <Tile style={{ flex: "1 1 auto" }}>Fills the main area; its own content scrolls.</Tile>
    </AdminShell>
  ),
};

export const WidePanel: Story = {
  args: { panel: <p>A document preview needs more room than help text.</p>, panelSize: 40 },
};
