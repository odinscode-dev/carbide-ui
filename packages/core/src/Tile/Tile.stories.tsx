import type { Decorator, Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { matrix } from "../../../../.storybook/matrix.js";
import { Tile, type TileProps } from "./Tile.js";

const meta: Meta<typeof Tile> = {
  title: "Core/Tile",
  component: Tile,
  args: { children: "Pump 3 · 1,250 l/min" },
  argTypes: { onSelect: { control: false } },
  decorators: [
    (Story) => (
      <div style={{ width: "16rem" }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof Tile>;

function SelectableTile(props: TileProps) {
  const [selected, setSelected] = useState(props.selected ?? false);
  return <Tile {...props} onSelect={setSelected} selected={selected} />;
}

export const Default: Story = {};

export const Static: Story = {};

export const Clickable: Story = { args: { clickable: true } };

export const Selectable: Story = { render: (args) => <SelectableTile {...args} /> };

export const Selected: Story = {
  args: { selected: true },
  render: (args) => <SelectableTile {...args} />,
};

export const Disabled: Story = { args: { clickable: true, disabled: true } };

export const LongText: Story = {
  args: {
    clickable: true,
    children:
      "A tile whose content is far longer than the tile is wide, so it wraps over several lines and shows that the padding and the border keep their shape.",
  },
};

// An instrument tile on a dashboard: lifted out of the page, lifts further under the pointer.
export const Raised: Story = { args: { elevation: "raised" } };

// The colour names what the tile shows; content can pick it up as --carbide-tile-accent.
export const Akzent: Story = {
  args: {
    elevation: "raised",
    accent: "var(--carbide-chart-series-2)",
    children: <span style={{ color: "var(--carbide-tile-accent)" }}>25.5 °C</span>,
  },
};

export const AkzentFlach: Story = { args: { accent: "var(--carbide-chart-series-1)" } };

export const Matrix: Story = {
  decorators: [matrix],
  parameters: { layout: "fullscreen" },
  render: () => (
    <div style={{ display: "grid", gap: "var(--carbide-sp-3)", width: "14rem" }}>
      <Tile>Static</Tile>
      <Tile clickable>Clickable</Tile>
      <Tile onSelect={() => undefined}>Selectable</Tile>
      <Tile onSelect={() => undefined} selected>
        Selected
      </Tile>
      <Tile clickable disabled>
        Disabled
      </Tile>
      <Tile disabled onSelect={() => undefined} selected>
        Disabled, selected
      </Tile>
      <Tile elevation="raised">Raised</Tile>
      <Tile accent="var(--carbide-chart-series-1)">Accent, flat</Tile>
      <Tile accent="var(--carbide-chart-series-2)" elevation="raised">
        Accent, raised
      </Tile>
      <Tile accent="var(--carbide-chart-series-4)" clickable elevation="raised">
        Accent, raised, clickable
      </Tile>
    </div>
  ),
};

/**
 * A stand-in for the background photo a glass pane is meant to sit on — the
 * effect is invisible over a flat surface, since the whole point is what the
 * blur does to what shows through.
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

export const GlassMatrix: Story = {
  decorators: [matrix, onPhoto],
  parameters: { layout: "fullscreen" },
  render: () => (
    <div style={{ display: "grid", gap: "var(--carbide-sp-3)", width: "14rem" }}>
      <Tile variant="glass">Static</Tile>
      <Tile clickable variant="glass">
        Clickable
      </Tile>
      <Tile onSelect={() => undefined} selected variant="glass">
        Selected
      </Tile>
      <Tile disabled onSelect={() => undefined} variant="glass">
        Disabled
      </Tile>
    </div>
  ),
};
