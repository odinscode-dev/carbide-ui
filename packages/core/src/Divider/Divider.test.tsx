import { describe, expect, it } from "vitest";
import { renderRoot } from "../test/render.js";
import { Divider } from "./Divider.js";

describe("Divider", () => {
  it("renders an hr, horizontal by default, without aria-orientation", () => {
    const { tag, attrs } = renderRoot(<Divider />);
    expect(tag).toBe("hr");
    expect(attrs["data-orientation"]).toBe("horizontal");
    expect(attrs).not.toHaveProperty("aria-orientation");
  });

  it("vertical: data-orientation and aria-orientation on the root element", () => {
    const { attrs } = renderRoot(<Divider orientation="vertical" />);
    expect(attrs["data-orientation"]).toBe("vertical");
    expect(attrs["aria-orientation"]).toBe("vertical");
  });

  it("passes native attributes through", () => {
    expect(renderRoot(<Divider id="d1" />).attrs.id).toBe("d1");
  });
});
