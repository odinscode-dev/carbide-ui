import { describe, expect, it } from "vitest";
import { renderPart, renderRoot } from "../test/render.js";
import { Avatar } from "./Avatar.js";

describe("Avatar", () => {
  it("uses the name as the accessible label", () => {
    const { attrs } = renderRoot(<Avatar name="Ada Lovelace" />);
    expect(attrs["aria-label"]).toBe("Ada Lovelace");
  });

  it("shows the full name in the fallback, not just initials", () => {
    const { markup } = renderRoot(<Avatar name="Ada Lovelace" />);
    expect(markup).toContain(">Ada Lovelace<");
  });

  it("shows a one-word name as-is", () => {
    const { markup } = renderRoot(<Avatar name="Cher" />);
    expect(markup).toContain(">Cher<");
  });

  it("renders an image when src is given", () => {
    const { markup } = renderRoot(<Avatar name="Ada Lovelace" src="/ada.jpg" />);
    expect(markup).toContain('src="/ada.jpg"');
  });

  it("renders no image when src is omitted", () => {
    const { markup } = renderRoot(<Avatar name="Ada Lovelace" />);
    expect(markup).not.toContain("<img");
  });

  it("carries data-image only when src is given", () => {
    expect(renderRoot(<Avatar name="Ada Lovelace" />).attrs["data-image"]).toBeUndefined();
    expect(
      renderPart(<Avatar name="Ada Lovelace" src="/ada.jpg" />, "root").attrs["data-image"],
    ).toBe("");
  });

  it("carries no data-role without the accountRole prop", () => {
    const { attrs } = renderRoot(<Avatar name="Ada Lovelace" />);
    expect(attrs["data-role"]).toBeUndefined();
  });

  it.each(["admin", "client"] as const)("carries accountRole %s as data-role", (accountRole) => {
    const { attrs } = renderRoot(<Avatar accountRole={accountRole} name="Ada Lovelace" />);
    expect(attrs["data-role"]).toBe(accountRole);
  });
});
