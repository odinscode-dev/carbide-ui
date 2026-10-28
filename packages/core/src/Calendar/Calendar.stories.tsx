import type { Meta, StoryObj } from "@storybook/react-vite";
import { matrix } from "../../../../.storybook/matrix.js";
import { Calendar } from "./Calendar.js";

const TODAY = new Date(2026, 8, 10);
const IS_WEEKEND = (date: Date) => date.getDay() === 0 || date.getDay() === 6;

const meta: Meta<typeof Calendar> = {
  title: "Core/Calendar",
  component: Calendar,
};
export default meta;

type Story = StoryObj<typeof Calendar>;

export const Default: Story = {};

export const WithValue: Story = { args: { value: TODAY } };

export const Range: Story = {
  args: { range: true, value: [TODAY, new Date(2026, 8, 17)] },
};

export const DisabledDates: Story = {
  args: { isDateDisabled: IS_WEEKEND, value: TODAY },
};

export const Matrix: Story = {
  decorators: [matrix],
  parameters: { layout: "fullscreen" },
  render: () => (
    <>
      <Calendar />
      <Calendar value={TODAY} />
      <Calendar range value={[TODAY, new Date(2026, 8, 17)]} />
    </>
  ),
};
