import type { Meta, StoryObj } from "@storybook/react-vite";
import { userEvent, within } from "storybook/test";
import { matrix } from "../../../../.storybook/matrix.js";
import { Breadcrumb } from "./Breadcrumb.js";

const PATH = [
  { label: "Plants", href: "#/plants" },
  { label: "Plant North", href: "#/plants/nord" },
  { label: "Line 4", href: "#/plants/nord/line-4" },
  { label: "Motor M-12" },
];

const DEPTH = [
  { label: "Plants", href: "#/plants" },
  { label: "Plant North", href: "#/plants/nord" },
  { label: "Hall 2", href: "#/plants/nord/hall-2" },
  { label: "Line 4", href: "#/plants/nord/hall-2/line-4" },
  { label: "Station 7", href: "#/plants/nord/hall-2/line-4/station-7" },
  { label: "Motor M-12" },
];

const meta: Meta<typeof Breadcrumb> = {
  title: "Core/Breadcrumb",
  component: Breadcrumb,
  args: { items: PATH },
  argTypes: { onFollow: { control: false } },
};
export default meta;

type Story = StoryObj<typeof Breadcrumb>;

export const Default: Story = {};

export const SingleItem: Story = { args: { items: [{ label: "Plants" }] } };

export const TwoItems: Story = { args: { items: PATH.slice(0, 2) } };

export const Collapsed: Story = { args: { items: DEPTH } };

export const CollapsedOpen: Story = {
  args: { items: DEPTH },
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole("button"));
  },
};

export const LongLabel: Story = {
  args: {
    items: [
      { label: "Plants", href: "#/plants" },
      { label: "Drive train of the packaging line in Plant North, Hall 2, Station 7" },
    ],
  },
};

export const WithoutLink: Story = {
  args: {
    items: [
      { label: "Plants", href: "#/plants" },
      { label: "Plant North" },
      { label: "Line 4", href: "#/plants/nord/line-4" },
      { label: "Motor M-12" },
    ],
  },
};

export const Matrix: Story = {
  decorators: [matrix],
  parameters: { layout: "fullscreen" },
  render: () => (
    <div style={{ display: "grid", gap: "var(--carbide-sp-5)" }}>
      <Breadcrumb items={PATH.slice(0, 1)} />
      <Breadcrumb items={PATH} />
      <Breadcrumb items={DEPTH} />
    </div>
  ),
};
