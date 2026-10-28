import { Tile } from "@odinscode/carbide-core";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { matrix } from "../../../../.storybook/matrix.js";
import { PageContainer } from "../PageContainer/index.js";
import { ShellMain } from "../primitives/ShellMain/index.js";
import { PageGrid } from "./PageGrid.js";

const meta: Meta<typeof PageGrid> = {
  title: "Shells/Floorplans/PageGrid",
  component: PageGrid,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof PageGrid>;

export const Default: Story = {
  render: (args) => (
    <div style={{ blockSize: "28rem" }}>
      <ShellMain>
        <PageGrid {...args}>
          <PageContainer span={10} blockSize="12rem">
            <Tile>10 of 16 columns</Tile>
          </PageContainer>
          <PageContainer span={6} blockSize="12rem">
            <Tile>6 of 16 columns</Tile>
          </PageContainer>
          <PageContainer span={16} blockSize="8rem">
            <Tile>The whole row</Tile>
          </PageContainer>
        </PageGrid>
      </ShellMain>
    </div>
  ),
};

export const Fill: Story = {
  render: () => (
    <div style={{ blockSize: "28rem" }}>
      <ShellMain layout="fill">
        <PageGrid fill>
          <PageContainer span={8}>
            <Tile>Shares the height with its row</Tile>
          </PageContainer>
          <PageContainer span={8}>
            <Tile>Second half</Tile>
          </PageContainer>
          <PageContainer span={4}>
            <Tile>Narrow</Tile>
          </PageContainer>
          <PageContainer span={12}>
            <Tile>Wide</Tile>
          </PageContainer>
        </PageGrid>
      </ShellMain>
    </div>
  ),
};

export const Matrix: Story = {
  decorators: [matrix],
  render: () => (
    <div style={{ blockSize: "16rem", inlineSize: "28rem" }}>
      <ShellMain layout="fill">
        <PageGrid fill>
          <PageContainer span={10}>
            <Tile>10</Tile>
          </PageContainer>
          <PageContainer span={6}>
            <Tile>6</Tile>
          </PageContainer>
        </PageGrid>
      </ShellMain>
    </div>
  ),
};
