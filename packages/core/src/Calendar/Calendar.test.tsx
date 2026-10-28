import { describe, expect, it } from "vitest";
import { renderRoot } from "../test/render.js";
import { Calendar } from "./Calendar.js";

const TODAY = new Date(2026, 8, 10);

describe("Calendar", () => {
  it("renders a div with the weekdays and the days of the month", () => {
    const { tag, markup } = renderRoot(<Calendar />);
    expect(tag).toBe("div");
    expect(markup).toContain(">10<");
  });

  it("shows the selected day as data-selected", () => {
    const { markup } = renderRoot(<Calendar value={TODAY} />);
    expect(markup).toMatch(/data-selected=""[^>]*>10</);
  });

  it("marks range start and end when range is set", () => {
    const { markup } = renderRoot(<Calendar range value={[TODAY, new Date(2026, 8, 17)]} />);
    expect(markup).toMatch(/data-range-start=""[^>]*>10</);
    expect(markup).toMatch(/data-range-end=""[^>]*>17</);
  });

  it("marks unselectable days via isDateDisabled as data-unavailable", () => {
    const saturday = new Date(2026, 8, 12);
    const { markup } = renderRoot(
      <Calendar isDateDisabled={(date) => date.getDay() === 6} value={saturday} />,
    );
    expect(markup).toMatch(/data-unavailable=""[^>]*>12</);
  });

  it("passes the id through to the root element", () => {
    expect(renderRoot(<Calendar id="pick" />).attrs.id).toBe("pick");
  });
});
