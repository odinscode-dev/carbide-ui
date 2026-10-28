// @vitest-environment jsdom

import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { must } from "../test/dom.js";
import { Tooltip } from "./Tooltip.js";

describe("Tooltip, z-index of .content", () => {
  afterEach(cleanup);

  it("has a declared z-index instead of auto, so Zag's Popper can adopt it", () => {
    render(
      <Tooltip content="Feed pump" defaultOpen>
        <button type="button">Pump 1</button>
      </Tooltip>,
    );
    const content = document.querySelector('[data-part="content"]');
    expect(content).not.toBeNull();
    expect(getComputedStyle(must(content)).zIndex).not.toBe("auto");
  });
});
