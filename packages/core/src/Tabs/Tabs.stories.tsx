import type { Decorator, Meta, StoryObj } from "@storybook/react-vite";
import type { CSSProperties } from "react";
import { matrix } from "../../../../.storybook/matrix.js";
import { type TabItem, Tabs } from "./Tabs.js";

const ITEMS: TabItem[] = [
  { value: "overview", label: "Overview", content: <p>Pump 1 is running at 42 l/min.</p> },
  { value: "history", label: "History", content: <p>No incidents in the last 30 days.</p> },
  {
    value: "maintenance",
    label: "Maintenance (locked)",
    disabled: true,
    content: <p>Not available.</p>,
  },
];

const MANY_ITEMS: TabItem[] = Array.from({ length: 12 }, (_, index) => ({
  value: `tab-${index}`,
  label: `Line ${index + 1}`,
  content: <p>Details for line {index + 1}.</p>,
}));

const meta: Meta<typeof Tabs> = {
  title: "Core/Tabs",
  component: Tabs,
  args: { items: ITEMS },
};
export default meta;

type Story = StoryObj<typeof Tabs>;

export const Default: Story = {};

export const ManyTabs: Story = {
  args: { items: MANY_ITEMS },
  render: (args) => (
    <div style={{ inlineSize: "24rem" }}>
      <Tabs {...args} />
    </div>
  ),
};

export const Matrix: Story = {
  decorators: [matrix],
  parameters: { layout: "fullscreen" },
  render: () => (
    <>
      <Tabs items={ITEMS} value="overview" />
      <div style={{ inlineSize: "16rem" }}>
        <Tabs items={MANY_ITEMS} value="tab-0" />
      </div>
    </>
  ),
};

/**
 * A stand-in for the background photo a glass pane is meant to sit on — the
 * effect is invisible over a flat surface.
 */
const onPhoto: Decorator = (Story) => (
  <div
    style={{
      padding: "var(--carbide-sp-6)",
      background:
        "conic-gradient(from 210deg at 30% 20%, #2f6d3a, #7fae46, #c9d17a, #2b5f7a, #2f6d3a)",
    }}
  >
    <Story />
  </div>
);

export const Glass: Story = {
  decorators: [onPhoto],
  args: { variant: "glass" },
};

const LOG_ENTRIES = Array.from({ length: 40 }, (_, index) => index + 1);

const LONG_ITEMS: TabItem[] = [
  {
    value: "log",
    label: "Log",
    content: (
      <div>
        {LOG_ENTRIES.map((entry) => (
          <p key={entry}>Entry {entry}: pump 1 running at 42 l/min.</p>
        ))}
      </div>
    ),
  },
  { value: "history", label: "History", content: <p>No incidents in the last 30 days.</p> },
];

const FILL_BOX: CSSProperties & { "--carbide-tabs-list-size": string } = {
  blockSize: "20rem",
  display: "flex",
  flexDirection: "column",
  "--carbide-tabs-list-size": "var(--carbide-sp-8)",
};

/**
 * `layout="fill"` in a box of fixed height: the strip stays, the log scrolls
 * under it. The box sets `--carbide-tabs-list-size` to a 48px tab band.
 */
export const Fill: Story = {
  args: { items: LONG_ITEMS, layout: "fill" },
  render: (args) => (
    <div style={FILL_BOX}>
      <Tabs {...args} />
    </div>
  ),
};
