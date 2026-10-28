// @vitest-environment jsdom

import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { CellStrip } from "./CellStrip.js";

afterEach(cleanup);

describe("CellStrip", () => {
  it("reads out the cells and gives each its tone", () => {
    render(
      <CellStrip
        cells={[
          { label: "Mon: 94 %", tone: "ok" },
          { label: "Tue: 64 %", tone: "alarm" },
        ]}
        label="Days in band"
      />,
    );
    const strip = screen.getByRole("img", { name: "Days in band. Mon: 94 %, Tue: 64 %" });
    const tones = [...strip.children].map((cell) =>
      cell instanceof HTMLElement ? cell.dataset.tone : undefined,
    );
    expect(tones).toEqual(["ok", "alarm"]);
    expect(strip.style.gridTemplateColumns).toBe("repeat(2, 1fr)");
  });
});
