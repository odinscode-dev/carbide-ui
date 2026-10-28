import { Button } from "@odinscode/carbide-core";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { matrix } from "../../../../../.storybook/matrix.js";
import { ShellHeader } from "./ShellHeader.js";

const meta: Meta<typeof ShellHeader> = {
  title: "Shells/Primitives/ShellHeader",
  component: ShellHeader,
  args: { title: "Plant 3" },
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof ShellHeader>;

export const Default: Story = {};

export const WithContext: Story = { args: { context: "Line 2 · last 24 hours" } };

// A status strip as a board would pass it: eyebrow labels over figures.
function StatusStrip() {
  const entries: [string, string][] = [
    ["Tasks", "2 overdue · 5 today"],
    ["Plant health", "1 284 · 7 flagged"],
    ["Last alarm", "Pressure line 2 · 12 min"],
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

export const WithStatus: Story = { args: { status: <StatusStrip /> } };

export const WithMenu: Story = { args: { onMenuClick: () => {} } };

export const MenuOpen: Story = { args: { menuOpen: true, onMenuClick: () => {} } };

export const WithActions: Story = {
  args: {
    actions: (
      <>
        <Button variant="ghost">Export</Button>
        <Button variant="primary">Acknowledge</Button>
      </>
    ),
  },
};

export const Full: Story = {
  args: {
    context: "Line 2 · last 24 hours",
    onMenuClick: () => {},
    status: <StatusStrip />,
    actions: <Button variant="primary">Acknowledge</Button>,
  },
};

export const LongTitle: Story = {
  args: {
    title: "Wastewater treatment plant 3, sedimentation basin B, sensor cluster north",
    context: "Line 2 · last 24 hours",
    status: <StatusStrip />,
    actions: <Button variant="primary">Acknowledge</Button>,
  },
};

export const Matrix: Story = {
  decorators: [matrix],
  parameters: { layout: "fullscreen" },
  args: {
    context: "Line 2 · last 24 hours",
    onMenuClick: () => {},
    actions: <Button variant="primary">Acknowledge</Button>,
  },
};

// The title block keeps its width whatever its text: a long context line is cut
// with an ellipsis (its full text is the tooltip) instead of pushing the status
// strip to the right.
export const WithStatusLongContext: Story = {
  args: {
    status: <StatusStrip />,
    context: "Plants › Greenhouse north › Pump station 2 › Maintenance plan for the winter season",
  },
};
