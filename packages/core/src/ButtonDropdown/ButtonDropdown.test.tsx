import { describe, expect, it } from "vitest";
import { renderRoot } from "../test/render.js";
import { ButtonDropdown, type ButtonDropdownItem } from "./ButtonDropdown.js";

const ITEMS: ButtonDropdownItem[] = [
  { id: "start", label: "Start" },
  { id: "stop", label: "Stop" },
];

describe("ButtonDropdown", () => {
  it("renders unsplit as one button with label and arrow", () => {
    const { tag, attrs, markup } = renderRoot(<ButtonDropdown items={ITEMS} label="Actions" />);
    expect(tag).toBe("div");
    expect(attrs["data-split"]).toBeUndefined();
    expect(markup).toContain("Actions");
    expect(markup).toContain("Start");
    expect(markup).toContain("Stop");
  });

  it("shows split as its own button in addition to the arrow", () => {
    const { attrs, markup } = renderRoot(<ButtonDropdown items={ITEMS} label="Start" split />);
    expect(attrs["data-split"]).toBe("");
    expect(markup.match(/<button/g)).toHaveLength(2);
  });

  it("gives the icon-only split trigger an accessible name", () => {
    const { markup } = renderRoot(<ButtonDropdown items={ITEMS} label="Start" split />);
    expect(markup).toMatch(/aria-label="More Start actions"/);
  });

  it("leaves the unsplit trigger without an aria-label since it has visible text", () => {
    const { markup } = renderRoot(<ButtonDropdown items={ITEMS} label="Actions" />);
    expect(markup).not.toMatch(/<button[^>]*aria-label=/);
  });

  it("writes the variant as data-variant on the root element", () => {
    expect(
      renderRoot(<ButtonDropdown items={ITEMS} label="Actions" variant="primary" />).attrs[
        "data-variant"
      ],
    ).toBe("primary");
  });

  it("locks both buttons when disabled is set", () => {
    const { markup } = renderRoot(<ButtonDropdown disabled items={ITEMS} label="Start" split />);
    expect(markup.match(/disabled=""/g)?.length).toBeGreaterThanOrEqual(2);
  });

  it("marks a dangerous entry with data-danger", () => {
    const { markup } = renderRoot(
      <ButtonDropdown items={[{ id: "delete", label: "Delete", danger: true }]} label="Actions" />,
    );
    expect(markup).toMatch(/data-danger=""[^>]*>Delete/);
  });

  it("shows a disabled entry with data-disabled", () => {
    const { markup } = renderRoot(
      <ButtonDropdown
        items={[{ id: "locked", label: "Locked", disabled: true }]}
        label="Actions"
      />,
    );
    expect(markup).toContain('aria-disabled="true"');
  });
});
