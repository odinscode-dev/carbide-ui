import type { Meta, StoryObj } from "@storybook/react-vite";
import { matrix } from "../../../../.storybook/matrix.js";
import { Sparkline } from "../charts/Sparkline.js";
import { Tile } from "../Tile/Tile.js";
import { Well } from "./Well.js";

const ROWS = [24.1, 24.4, 24.9, 25.3, 25.1, 25.6, 25.4, 25.9, 25.5].map((temp) => ({ temp }));

const meta: Meta<typeof Well> = {
  title: "Components/Well",
  component: Well,
  args: {
    title: "Last hour",
    value: "25.1 … 25.9 °C",
    children: (
      <Sparkline
        accessorKey="temp"
        data={ROWS}
        domainPadding={0.2}
        height={32}
        stroke="var(--carbide-chart-series-2)"
      />
    ),
  },
  decorators: [
    (Story) => (
      <Tile elevation="raised" style={{ width: "16rem" }}>
        <Story />
      </Tile>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof Well>;

export const Default: Story = {};

export const OhneKopf: Story = { args: { title: undefined, value: undefined } };

export const LangerTitel: Story = {
  args: { title: "Learned rise per 2 %-points of lamp dimming over the last week" },
};

export const Matrix: Story = {
  decorators: [matrix],
  parameters: { layout: "fullscreen" },
  render: () => (
    <Tile elevation="raised" style={{ width: "14rem" }}>
      <Well title="Last hour" value="25.1 … 25.9 °C">
        <Sparkline
          accessorKey="temp"
          data={ROWS}
          domainPadding={0.2}
          height={32}
          stroke="var(--carbide-chart-series-2)"
        />
      </Well>
    </Tile>
  ),
};
