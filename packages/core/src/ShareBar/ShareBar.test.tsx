// @vitest-environment jsdom

import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { ShareBar, shares } from "./ShareBar.js";

afterEach(cleanup);

describe("shares", () => {
  it("turns weights into percent of their sum, negative as zero", () => {
    expect(
      shares([
        { label: "a", value: 1, color: "red" },
        { label: "b", value: 3, color: "blue" },
        { label: "c", value: -2, color: "green" },
      ]),
    ).toEqual([25, 75, 0]);
    expect(shares([{ label: "a", value: 0, color: "red" }])).toEqual([0]);
  });
});

describe("ShareBar", () => {
  it("is an image that reads out each part's share", () => {
    render(
      <ShareBar
        label="Actions"
        parts={[
          { label: "Heating", value: 1, color: "red" },
          { label: "Idle", value: 3, color: "gray" },
        ]}
      />,
    );
    const bar = screen.getByRole("img", { name: "Actions: Heating 25 %, Idle 75 %" });
    expect(bar.children).toHaveLength(2);
  });
});
