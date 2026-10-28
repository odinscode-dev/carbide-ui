import { describe, expect, it } from "vitest";
import { renderRoot } from "../test/render.js";
import { Spinner } from "./Spinner.js";

describe("Spinner", () => {
  it("renders as SVG and is hidden from assistive tech", () => {
    const { tag, attrs } = renderRoot(<Spinner />);
    expect(tag).toBe("svg");
    expect(attrs["aria-hidden"]).toBe("true");
  });

  it("sizes itself via 1em, like any other icon in a button", () => {
    const { attrs } = renderRoot(<Spinner />);
    expect(attrs.width).toBe("1em");
    expect(attrs.height).toBe("1em");
  });

  it("carries no role and no text -- the caller reports the state", () => {
    const { markup } = renderRoot(<Spinner />);
    expect(markup).not.toContain("role=");
  });

  it("passes native attributes through", () => {
    expect(renderRoot(<Spinner id="s1" />).attrs.id).toBe("s1");
  });
});
