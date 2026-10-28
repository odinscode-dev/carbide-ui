import { describe, expect, it } from "vitest";
import { renderPart, renderRoot } from "../test/render.js";
import { ProgressBar } from "./ProgressBar.js";

describe("ProgressBar", () => {
  it("renders label and track with role progressbar", () => {
    const { tag, markup } = renderRoot(<ProgressBar label="Filling tank 2" value={42} />);
    expect(tag).toBe("div");
    expect(markup).toContain("Filling tank 2");

    const track = renderPart(<ProgressBar label="Filling tank 2" value={42} />, "track");
    expect(track.attrs.role).toBe("progressbar");
    expect(track.attrs["aria-valuenow"]).toBe("42");
    expect(track.attrs["aria-valuemax"]).toBe("100");
  });

  it("accepts a different max", () => {
    const { attrs } = renderPart(<ProgressBar label="Filling" max={1200} value={300} />, "track");
    expect(attrs["aria-valuemax"]).toBe("1200");
    expect(attrs["aria-valuenow"]).toBe("300");
  });

  it("leaves the value out when indeterminate and reports the state", () => {
    const { attrs } = renderPart(<ProgressBar indeterminate label="Waiting" />, "track");
    expect(attrs).not.toHaveProperty("aria-valuenow");
    expect(attrs["data-state"]).toBe("indeterminate");
  });

  it("writes state as data-status on the root element, not as data-state", () => {
    const { attrs } = renderRoot(<ProgressBar label="Filled" state="ok" value={100} />);
    expect(attrs["data-status"]).toBe("ok");

    expect(attrs["data-state"]).toBe("complete");

    expect(
      renderRoot(<ProgressBar label="Stopped" state="alarm" value={68} />).attrs["data-status"],
    ).toBe("alarm");
    expect(renderRoot(<ProgressBar label="Filling" value={68} />).attrs).not.toHaveProperty(
      "data-status",
    );
  });

  it("attaches the help text to the root element via aria-describedby", () => {
    const { attrs, markup } = renderRoot(
      <ProgressBar helperText="About 4 minutes left" label="Filling" value={42} />,
    );
    const described = attrs["aria-describedby"];
    expect(described).toBeDefined();
    expect(markup).toContain(`id="${described}"`);
    expect(markup).toContain("About 4 minutes left");
  });

  it("leaves out the help text when there is none", () => {
    const { attrs, markup } = renderRoot(<ProgressBar label="Filling" value={42} />);
    expect(attrs).not.toHaveProperty("aria-describedby");
    expect(markup).not.toContain("<p");
  });

  it("shows an icon only when reaching state ok", () => {
    expect(renderRoot(<ProgressBar label="Filled" state="ok" value={100} />).markup).toContain(
      '<svg aria-hidden="true"',
    );
    expect(renderRoot(<ProgressBar label="Filling" value={42} />).markup).not.toContain("<svg");
  });

  it("passes native attributes through", () => {
    expect(renderRoot(<ProgressBar id="p1" label="Filling" value={42} />).attrs.id).toBe("p1");
  });
});
