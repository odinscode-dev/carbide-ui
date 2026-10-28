// @vitest-environment jsdom

import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { MiniBars } from "./MiniBars.js";

afterEach(cleanup);

describe("MiniBars", () => {
  it("reads out each slot and scales the bars to the largest value", () => {
    render(<MiniBars label="Pulses" slots={["0:00", "1:00", "2:00"]} values={[4, 2, null]} />);
    const root = screen.getByRole("img", { name: "Pulses. 0:00: 4, 1:00: 2, 2:00: -" });
    const bars = [...root.children].filter((bar) => bar instanceof HTMLElement);
    expect(bars.map((bar) => bar.style.blockSize)).toEqual(["100%", "50%", "0%"]);
    expect(bars.map((bar) => bar.dataset.empty)).toEqual([undefined, undefined, ""]);
  });

  it("scales to a given maximum", () => {
    render(<MiniBars label="Pulses" max={8} values={[4]} />);
    const bar = screen.getByRole("img").firstElementChild;
    if (!(bar instanceof HTMLElement)) throw new Error("no bar");
    expect(bar.style.blockSize).toBe("50%");
  });
});
