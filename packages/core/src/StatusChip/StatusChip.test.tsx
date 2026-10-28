// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { renderRoot } from "../test/render.js";
import { StatusChip } from "./StatusChip.js";

describe("StatusChip", () => {
  it("shows value and caption with the tone on the root", () => {
    const { tag, attrs, markup } = renderRoot(
      <StatusChip caption="in band" title="Inside" tone="warn" value="25.5 °C" />,
    );
    expect(tag).toBe("span");
    expect(attrs["data-tone"]).toBe("warn");
    expect(attrs.title).toBe("Inside");
    expect(markup).toContain("25.5 °C");
    expect(markup).toContain("in band");
  });

  it("is neutral by default and leaves out what it is not given", () => {
    const { attrs, markup } = renderRoot(<StatusChip value="354 W" />);
    expect(attrs["data-tone"]).toBe("neutral");
    expect(markup).not.toContain("aria-hidden");
  });
});
