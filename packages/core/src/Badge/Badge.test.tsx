import { describe, expect, it } from "vitest";
import { formatNumber } from "../format/number.js";
import { renderRoot } from "../test/render.js";
import { Badge } from "./Badge.js";

describe("Badge", () => {
  it("renders a span with text and data-state neutral by default", () => {
    const { tag, attrs, markup } = renderRoot(<Badge>New</Badge>);
    expect(tag).toBe("span");
    expect(attrs["data-state"]).toBe("neutral");
    expect(attrs).not.toHaveProperty("data-count");
    expect(markup).toContain("New");
  });

  it("writes the state as data-state on the root element", () => {
    expect(renderRoot(<Badge state="warn">x</Badge>).attrs["data-state"]).toBe("warn");
  });

  it("shows the counter formatted and marks it with data-count", () => {
    const { attrs, markup } = renderRoot(<Badge count={1250} />);
    expect(attrs["data-count"]).toBe("");
    expect(markup).toContain(formatNumber(1250));
  });

  it("shows no children when count is set", () => {
    const { markup } = renderRoot(<Badge count={3}>hidden</Badge>);
    expect(markup).not.toContain("hidden");
  });

  it("passes native attributes through", () => {
    expect(renderRoot(<Badge title="3 alarms">3</Badge>).attrs.title).toBe("3 alarms");
  });
});
