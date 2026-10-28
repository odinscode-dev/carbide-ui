import { Button, DataGrid, type DataGridColumn } from "@odinscode/carbide-core";
import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactNode } from "react";
import { matrix } from "../../../../.storybook/matrix.js";
import { ShellMain } from "../primitives/ShellMain/index.js";
import { ListReport } from "./ListReport.js";

interface Charge {
  id: string;
  batch: string;
  cultivar: string;
  room: string;
}

const ROWS: Charge[] = Array.from({ length: 40 }, (_, index) => ({
  id: String(index + 1),
  batch: `B-${String(index + 1).padStart(5, "0")}`,
  cultivar: ["Aurora", "Borealis", "Cascade"][index % 3] ?? "",
  room: ["Hall 1", "Hall 2", "Nursery"][index % 3] ?? "",
}));

const COLUMNS: DataGridColumn<Charge>[] = [
  { accessorKey: "batch", header: "Batch", id: "batch", width: "7rem" },
  { accessorKey: "cultivar", header: "Cultivar", id: "cultivar" },
  { accessorKey: "room", header: "Room", id: "room" },
];

function Page({ children }: { children: ReactNode }) {
  return (
    <div style={{ blockSize: "32rem" }}>
      <ShellMain layout="fill">{children}</ShellMain>
    </div>
  );
}

const meta: Meta<typeof ListReport> = {
  title: "Shells/Floorplans/ListReport",
  component: ListReport,
  parameters: { layout: "fullscreen" },
  args: {
    title: "Batches",
    meta: "40 batches",
    actions: <Button>New batch</Button>,
    filters: <span>Filters</span>,
    children: <DataGrid columns={COLUMNS} rows={ROWS} />,
  },
  render: (args) => (
    <Page>
      <ListReport {...args} />
    </Page>
  ),
};
export default meta;

type Story = StoryObj<typeof ListReport>;

export const Default: Story = {};

export const WithoutMetaAndActions: Story = { args: { meta: undefined, actions: undefined } };

export const Empty: Story = { args: { children: <p>No batches yet.</p> } };

export const Matrix: Story = {
  decorators: [matrix],
  render: (args) => (
    <div style={{ blockSize: "20rem" }}>
      <ShellMain layout="fill">
        <ListReport {...args} />
      </ShellMain>
    </div>
  ),
};
