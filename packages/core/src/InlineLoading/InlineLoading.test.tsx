import { describe, expect, it } from "vitest";
import { renderRoot } from "../test/render.js";
import { InlineLoading } from "./InlineLoading.js";

describe("InlineLoading", () => {
  it("renders the running state by default", () => {
    const { tag, attrs } = renderRoot(<InlineLoading />);
    expect(tag).toBe("div");
    expect(attrs["data-status"]).toBe("active");
    expect(attrs.role).toBe("status");
    expect(attrs["aria-busy"]).toBe("true");
  });

  it("writes every state as data-status on the root element", () => {
    expect(renderRoot(<InlineLoading status="finished" />).attrs["data-status"]).toBe("finished");
    expect(renderRoot(<InlineLoading status="error" />).attrs["data-status"]).toBe("error");
  });

  it("reports aria-busy only while active", () => {
    expect(renderRoot(<InlineLoading status="finished" />).attrs).not.toHaveProperty("aria-busy");
    expect(renderRoot(<InlineLoading status="error" />).attrs).not.toHaveProperty("aria-busy");
  });

  it("shows the description and omits it when there is none", () => {
    expect(renderRoot(<InlineLoading description="Writing recipe" />).markup).toContain(
      "Writing recipe",
    );
    expect(renderRoot(<InlineLoading />).markup).not.toContain("<span");
  });

  it("keeps the glyph hidden from assistive tech", () => {
    expect(renderRoot(<InlineLoading />).markup).toContain('<svg aria-hidden="true"');
  });

  it("passes native attributes through", () => {
    expect(renderRoot(<InlineLoading id="l1" />).attrs.id).toBe("l1");
  });
});
