// @vitest-environment jsdom

import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Timeline, timelinePosition } from "./Timeline.js";

afterEach(cleanup);

describe("timelinePosition", () => {
  it("maps onto the line and clamps to its ends", () => {
    expect(timelinePosition(15, 10, 20)).toBe(50);
    expect(timelinePosition(5, 10, 20)).toBe(0);
    expect(timelinePosition(25, 10, 20)).toBe(100);
    expect(timelinePosition(1, 1, 1)).toBe(0);
  });
});

describe("Timeline", () => {
  it("reads out ranges and marks and places them on the line", () => {
    render(
      <Timeline
        from={0}
        label="Today"
        marks={[{ at: 75, label: "Dose" }]}
        now={50}
        ranges={[{ start: 25, end: 75, label: "Free" }]}
        ticks={[
          { at: 0, label: "0:00" },
          { at: 100, label: "24:00" },
        ]}
        to={100}
      />,
    );
    const track = screen.getByRole("img", { name: "Today. Free, Dose" });
    const range = track.querySelector("[title='Free']");
    if (!(range instanceof HTMLElement)) throw new Error("no range");
    expect([range.style.insetInlineStart, range.style.inlineSize]).toEqual(["25%", "50%"]);
    expect(track.querySelector("[title='Now']")).not.toBeNull();
    expect(screen.getByText("0:00").dataset.edge).toBe("start");
    expect(screen.getByText("24:00").dataset.edge).toBe("end");
  });
});
