import { Tile } from "@odinscode/carbide-core";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { matrix } from "../../../../.storybook/matrix.js";
import { HomeDashboard, type HomeDashboardItem } from "./HomeDashboard.js";

const meta: Meta<typeof HomeDashboard> = {
  title: "Home/HomeDashboard",
  component: HomeDashboard,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof HomeDashboard>;

const evenItems: HomeDashboardItem[] = [
  { id: "1", content: <Tile>1</Tile> },
  { id: "2", content: <Tile>2</Tile> },
  { id: "3", content: <Tile>3</Tile> },
  { id: "4", content: <Tile>4</Tile> },
];

export const Default: Story = {
  render: () => (
    <div style={{ padding: "1rem" }}>
      <HomeDashboard items={evenItems} />
    </div>
  ),
};

const withHeroTile: HomeDashboardItem[] = [
  { id: "1", content: <Tile>1</Tile> },
  { id: "2", content: <Tile>2</Tile> },
  { id: "3", columnSpan: 2, content: <Tile>3</Tile> },
  { id: "4", columnSpan: 2, content: <Tile>4</Tile> },
  { id: "7", content: <Tile>7</Tile> },
  { id: "8", content: <Tile>8</Tile> },
  { id: "hero", columnSpan: 12, content: <Tile>24</Tile>, rowSpan: 3 },
];

export const WithHeroTile: Story = {
  render: () => (
    <div style={{ padding: "1rem" }}>
      <HomeDashboard items={withHeroTile} />
    </div>
  ),
};

export const Matrix: Story = {
  decorators: [matrix],
  parameters: { layout: "fullscreen" },
  render: () => (
    <div style={{ inlineSize: "40rem", padding: "1rem" }}>
      <HomeDashboard items={evenItems} />
    </div>
  ),
};
