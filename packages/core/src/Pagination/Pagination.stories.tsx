import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { matrix } from "../../../../.storybook/matrix.js";
import { Pagination, type PaginationProps } from "./Pagination.js";

function ControlledPagination(props: PaginationProps) {
  const [page, setPage] = useState(props.page);
  const [pageSize, setPageSize] = useState(props.pageSize);
  return (
    <Pagination
      {...props}
      onPageChange={setPage}
      onPageSizeChange={(size) => {
        setPageSize(size);
        setPage(1);
      }}
      page={page}
      pageSize={pageSize}
    />
  );
}

const meta: Meta<typeof Pagination> = {
  title: "Core/Pagination",
  component: Pagination,
  args: { page: 1, pageSize: 25, total: 1250 },
  argTypes: { onPageChange: { control: false }, onPageSizeChange: { control: false } },
  render: (args) => <ControlledPagination {...args} />,
  decorators: [
    (Story) => (
      <div style={{ width: "44rem", maxWidth: "100%" }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof Pagination>;

export const Default: Story = {};

export const MiddlePage: Story = { args: { page: 25 } };

export const LastPage: Story = { args: { page: 50 } };

export const Disabled: Story = { args: { disabled: true, page: 25 } };

export const SinglePage: Story = { args: { total: 12 } };

export const LargeCount: Story = { args: { page: 4096, pageSize: 100, total: 9_876_543 } };

export const Matrix: Story = {
  decorators: [matrix],
  parameters: { layout: "fullscreen" },
  render: () => (
    <div style={{ display: "grid", gap: "var(--carbide-sp-6)" }}>
      <Pagination page={1} pageSize={25} total={1250} />
      <Pagination page={25} pageSize={25} total={1250} />
      <Pagination page={50} pageSize={25} total={1250} />
      <Pagination disabled page={25} pageSize={25} total={1250} />
    </div>
  ),
};
