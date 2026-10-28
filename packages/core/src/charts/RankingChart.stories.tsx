import type { Meta, StoryObj } from "@storybook/react-vite";
import { RankingChart } from "./RankingChart.js";

const ITEMS = [
  { id: "irrigation", label: "Irrigation schedule", value: 42 },
  { id: "pumps", label: "Pump maintenance", value: 31 },
  { id: "nutrients", label: "Nutrient mixing", value: 24 },
  { id: "climate", label: "Climate set points", value: 17 },
  { id: "alarms", label: "Alarm handling", value: 9 },
];

const meta: Meta<typeof RankingChart> = {
  title: "Charts/RankingChart",
  component: RankingChart,
  args: { items: ITEMS, name: "Searches" },
};
export default meta;

type Story = StoryObj<typeof RankingChart>;

export const Default: Story = {};

export const OtherSlot: Story = { args: { slot: 3 } };

export const WithUnit: Story = {
  args: {
    name: "Volume",
    unit: "ml",
    items: ITEMS.map((item) => ({ ...item, value: item.value * 125 })),
  },
};

// Labels longer than the column stay on one line and are cut with an ellipsis,
// not wrapped into the neighbouring rows; the full text is the label's title.
export const LongLabels: Story = {
  args: {
    labelWidth: 200,
    items: [
      { id: "a", label: "Maintenance plan for the north greenhouse pump station", value: 12 },
      { id: "b", label: "Short", value: 7 },
    ],
  },
};

export const Empty: Story = { args: { items: [] } };

// Whole sentences, as a search log has them, in the default column: each label
// stays on its row, cut with an ellipsis; hovering a bar shows the full text.
export const Sentences: Story = {
  args: {
    name: "Searches",
    items: [
      { id: "a", label: "How do I add a new document to the operations department?", value: 8 },
      {
        id: "b",
        label: "Which document describes the backup schedule and who checks it?",
        value: 6,
      },
      { id: "c", label: "License", value: 5 },
      {
        id: "d",
        label: "What did we decide about the shell scrolling behaviour at 1920 px?",
        value: 3,
      },
    ],
  },
};
