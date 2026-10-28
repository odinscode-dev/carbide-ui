import { Tile } from "@odinscode/carbide-core";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { matrix } from "../../../../../.storybook/matrix.js";
import { HomeMain } from "./HomeMain.js";

const meta: Meta<typeof HomeMain> = {
  title: "Home/Primitives/HomeMain",
  component: HomeMain,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof HomeMain>;

export const Default: Story = {
  render: () => (
    <div style={{ blockSize: "24rem" }}>
      <HomeMain>
        <Tile>Overview</Tile>
        <Tile>Charts</Tile>
      </HomeMain>
    </div>
  ),
};

export const LongContent: Story = {
  render: () => (
    <div style={{ blockSize: "24rem" }}>
      <HomeMain>
        {Array.from({ length: 20 }, (_, index) => `Section ${index + 1}`).map((section) => (
          <Tile key={section}>{section}</Tile>
        ))}
      </HomeMain>
    </div>
  ),
};

export const Matrix: Story = {
  decorators: [matrix],
  parameters: { layout: "fullscreen" },
  render: () => (
    <div style={{ blockSize: "16rem", inlineSize: "20rem" }}>
      <HomeMain>
        <Tile>Overview</Tile>
      </HomeMain>
    </div>
  ),
};
