// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { renderRoot } from "../test/render.js";
import { Well } from "./Well.js";

describe("Well", () => {
  it("shows the caption line and the content", () => {
    const { tag, markup } = renderRoot(
      <Well title="Last hour" value="25.9 °C">
        <i>line</i>
      </Well>,
    );
    expect(tag).toBe("div");
    expect(markup).toContain("Last hour");
    expect(markup).toContain("25.9 °C");
    expect(markup).toContain("<i>line</i>");
  });

  it("has no caption line without title and value", () => {
    const { markup } = renderRoot(<Well id="w">x</Well>);
    expect(markup.match(/<div/g)).toHaveLength(1);
  });
});
