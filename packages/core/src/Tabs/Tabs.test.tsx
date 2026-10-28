import { describe, expect, it } from "vitest";
import { renderRoot } from "../test/render.js";
import { type TabItem, Tabs } from "./Tabs.js";

const ITEMS: TabItem[] = [
  { value: "a", label: "Tab A", content: "Content A" },
  { value: "b", label: "Tab B", content: "Content B" },
];

describe("Tabs", () => {
  it("renders a div with one tab per item and the selected one's content", () => {
    const { tag, markup } = renderRoot(<Tabs items={ITEMS} value="a" />);
    expect(tag).toBe("div");
    expect(markup).toContain("Tab A");
    expect(markup).toContain("Tab B");
    expect(markup).toContain("Content A");
  });

  it("marks the selected tab with data-selected", () => {
    const { markup } = renderRoot(<Tabs items={ITEMS} value="b" />);
    expect(markup).toMatch(/data-selected=""[^>]*>Tab B/);
  });

  it("shows a disabled tab as disabled", () => {
    const { markup } = renderRoot(
      <Tabs items={[{ value: "a", label: "A", disabled: true, content: "x" }]} />,
    );
    expect(markup).toMatch(/<button[^>]*disabled=""[^>]*>A/);
  });

  it("shows an icon before the label when set", () => {
    const { markup } = renderRoot(
      <Tabs items={[{ value: "a", label: "A", icon: <svg data-testid="icon" />, content: "x" }]} />,
    );
    expect(markup).toContain('data-testid="icon"');
  });

  it("passes the id through to the root element", () => {
    expect(renderRoot(<Tabs id="lines" items={ITEMS} />).attrs.id).toBe("lines");
  });

  it("variant: glass marks the tab strip as a pane, not the panels", () => {
    const { markup } = renderRoot(<Tabs items={ITEMS} value="a" variant="glass" />);
    expect(markup).toMatch(/<div[^>]*data-part="list"[^>]*data-variant="glass"/);
    expect(markup).not.toMatch(/data-part="content"[^>]*data-variant="glass"/);
  });

  it("variant: the default leaves the attribute off", () => {
    const { markup } = renderRoot(<Tabs items={ITEMS} value="a" />);
    expect(markup).not.toContain("data-variant");
  });

  it("layout: flow is the default and renders the panel content directly", () => {
    const { attrs, markup } = renderRoot(<Tabs items={ITEMS} value="a" />);
    expect(attrs["data-layout"]).toBe("flow");
    expect(markup).toMatch(/role="tabpanel"[^>]*>Content A</);
  });

  it("layout: fill scrolls each panel's content in its own ScrollArea", () => {
    const { attrs, markup } = renderRoot(<Tabs items={ITEMS} value="a" layout="fill" />);
    expect(attrs["data-layout"]).toBe("fill");
    expect(markup).toMatch(
      /role="tabpanel"[^>]*><div data-scope="scroll-area" data-part="root"[^>]*data-axis="vertical"/,
    );
  });
});
