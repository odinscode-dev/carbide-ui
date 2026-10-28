import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { matrix } from "../../../../.storybook/matrix.js";
import { Tree, type TreeNode, type TreeProps } from "./Tree.js";

function SiteIcon() {
  return (
    <svg aria-hidden="true" fill="none" stroke="currentcolor" strokeWidth="1.5" viewBox="0 0 16 16">
      <path d="M2.5 13.5v-7l5.5-4 5.5 4v7z" strokeLinejoin="round" />
    </svg>
  );
}

function PumpIcon() {
  return (
    <svg aria-hidden="true" fill="none" stroke="currentcolor" strokeWidth="1.5" viewBox="0 0 16 16">
      <circle cx="8" cy="8" r="5.5" />
      <path d="M8 4.5V8l2.5 2" strokeLinecap="round" />
    </svg>
  );
}

const NODES: TreeNode[] = [
  {
    id: "hall-1",
    label: "Hall 1",
    icon: <SiteIcon />,
    children: [
      {
        id: "line-a",
        label: "Line A",
        children: [
          { id: "pump-1", label: "Pump 1", icon: <PumpIcon /> },
          { id: "pump-2", label: "Pump 2", icon: <PumpIcon />, disabled: true },
        ],
      },
      {
        id: "line-b",
        label: "Line B",
        children: [{ id: "pump-3", label: "Pump 3", icon: <PumpIcon /> }],
      },
    ],
  },
  {
    id: "hall-2",
    label: "Hall 2",
    icon: <SiteIcon />,
    children: [{ id: "pump-4", label: "Pump 4", icon: <PumpIcon /> }],
  },
  { id: "tank", label: "Tank farm" },
];

function withoutIcons(nodes: TreeNode[]): TreeNode[] {
  return nodes.map(({ icon: _icon, children, ...rest }) => ({
    ...rest,
    ...(children === undefined ? {} : { children: withoutIcons(children) }),
  }));
}

const WITHOUT_ICONS = withoutIcons(NODES);

function ControlledTree(props: TreeProps) {
  const [expanded, setExpanded] = useState<string[]>(props.expanded ?? []);
  const [selected, setSelected] = useState(props.selected);
  return (
    <Tree
      {...props}
      expanded={expanded}
      onExpandedChange={setExpanded}
      onSelectedChange={setSelected}
      selected={selected}
    />
  );
}

const meta: Meta<typeof Tree> = {
  title: "Core/Tree",
  component: Tree,
  args: { nodes: NODES, expanded: ["hall-1", "line-a"], selected: "pump-1" },
  argTypes: { onExpandedChange: { control: false }, onSelectedChange: { control: false } },
  render: (args) => <ControlledTree {...args} />,
  decorators: [
    (Story) => (
      <div style={{ width: "18rem" }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof Tree>;

export const Default: Story = {};

export const Open: Story = { args: { expanded: ["hall-1", "line-a", "line-b", "hall-2"] } };

export const Closed: Story = { args: { expanded: [], selected: undefined } };

export const WithoutIcons: Story = { args: { nodes: WITHOUT_ICONS } };

export const Selected: Story = { args: { expanded: ["hall-1"], selected: "line-b" } };

export const Disabled: Story = { args: { selected: undefined } };

export const Empty: Story = { args: { nodes: [], expanded: [], selected: undefined } };

export const LongLabel: Story = {
  args: {
    nodes: [
      {
        id: "long",
        label: "A branch whose label is far longer than the tree is wide",
        icon: <SiteIcon />,
        children: [
          {
            id: "long-leaf",
            label: "And a leaf below it with a label that is just as long as the one above",
            icon: <PumpIcon />,
          },
        ],
      },
    ],
    expanded: ["long"],
    selected: "long-leaf",
  },
};

export const Matrix: Story = {
  decorators: [matrix],
  parameters: { layout: "fullscreen" },
  render: () => (
    <div style={{ display: "grid", gap: "var(--carbide-sp-3)", width: "18rem" }}>
      <Tree expanded={["hall-1", "line-a"]} nodes={NODES} selected="pump-1" />
      <Tree nodes={[]} />
    </div>
  ),
};
