import { Button, Tag } from "@odinscode/carbide-core";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { matrix } from "../../../../.storybook/matrix.js";
import { ShellMain } from "../primitives/ShellMain/index.js";
import { ObjectPage, type ObjectPageProps } from "./ObjectPage.js";

const TABS: ObjectPageProps["tabs"] = [
  { value: "overview", label: "Overview", content: <p>Overview</p> },
  {
    value: "history",
    label: "History",
    content: Array.from({ length: 40 }, (_, index) => `Entry ${index + 1}`).map((entry) => (
      <p key={entry}>{entry}</p>
    )),
  },
  { value: "settings", label: "Settings", content: <p>Settings</p> },
];

const FACTS: ObjectPageProps["facts"] = [
  { id: "room", label: "Room", value: "Hall 1" },
  { id: "plants", label: "Plants", value: "240" },
  { id: "since", label: "Since", value: "2026-09-01" },
];

function Interactive(args: Omit<ObjectPageProps, "tab" | "onTabChange">) {
  const [tab, setTab] = useState("overview");
  return (
    <div style={{ blockSize: "32rem" }}>
      <ShellMain layout="fill">
        <ObjectPage {...args} onTabChange={setTab} tab={tab} />
      </ShellMain>
    </div>
  );
}

const meta: Meta<typeof Interactive> = {
  title: "Shells/Floorplans/ObjectPage",
  component: Interactive,
  parameters: { layout: "fullscreen" },
  args: {
    breadcrumb: "Batches",
    title: "B-00001",
    status: <Tag>Active</Tag>,
    actions: <Button>Edit</Button>,
    facts: FACTS,
    tabs: TABS,
  },
};
export default meta;

type Story = StoryObj<typeof Interactive>;

export const Default: Story = {};

export const WithoutBreadcrumbAndStatus: Story = {
  args: { breadcrumb: undefined, status: undefined, actions: undefined },
};

export const LongTitleAndFact: Story = {
  args: {
    title: "A very long object name that does not fit into the title zone of the page at all",
    facts: [
      {
        id: "departments",
        label: "Departments",
        value: "Cultivation, Drying, Packaging, Quality, Logistics, Administration, Research",
        title: "Cultivation, Drying, Packaging, Quality, Logistics, Administration, Research",
      },
      ...FACTS,
    ],
  },
};

export const Matrix: Story = {
  decorators: [matrix],
  render: (args) => (
    <div style={{ blockSize: "22rem" }}>
      <ShellMain layout="fill">
        <ObjectPage {...args} onTabChange={() => undefined} tab="overview" />
      </ShellMain>
    </div>
  ),
};
