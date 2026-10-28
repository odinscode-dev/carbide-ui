import { describe, expect, it } from "vitest";
import { renderRoot } from "../test/render.js";
import { Tree, type TreeNode } from "./Tree.js";

const NODES: TreeNode[] = [
  {
    id: "hall-1",
    label: "Hall 1",
    children: [
      { id: "pump-1", label: "Pump 1" },
      { id: "pump-2", label: "Pump 2", disabled: true },
    ],
  },
  { id: "tank", label: "Tank farm" },
];

describe("Tree", () => {
  it("renders a tree with role tree and one treeitem per node", () => {
    const { tag, attrs, markup } = renderRoot(<Tree expanded={["hall-1"]} nodes={NODES} />);
    expect(tag).toBe("div");
    expect(attrs).not.toHaveProperty("data-empty");
    expect(markup).toContain('role="tree"');
    expect(markup.match(/role="treeitem"/g)).toHaveLength(4);
  });

  it("shows a branch open or closed based on expanded", () => {
    const open = renderRoot(<Tree expanded={["hall-1"]} nodes={NODES} />).markup;
    expect(open).toMatch(/data-part="branch" data-state="open"/);
    expect(open).not.toMatch(/data-part="branch-content"[^>]* hidden/);

    const closed = renderRoot(<Tree expanded={[]} nodes={NODES} />).markup;
    expect(closed).toMatch(/data-part="branch" data-state="closed"/);
    expect(closed).toMatch(/data-part="branch-content"[^>]* hidden/);
  });

  it("is closed without expanded and lets Ark drive the state", () => {
    expect(renderRoot(<Tree nodes={NODES} />).markup).toMatch(
      /data-part="branch" data-state="closed"/,
    );
  });

  it("renders a leaf as an item without an arrow and a branch with one", () => {
    const { markup } = renderRoot(<Tree nodes={NODES} />);
    expect(markup).toMatch(/data-part="item"[^>]*data-value="tank"/);
    expect(markup).toMatch(/data-part="branch-indicator"[^>]*><svg/);
  });

  it("marks the selected row with aria-selected and data-selected", () => {
    const { markup } = renderRoot(<Tree expanded={["hall-1"]} nodes={NODES} selected="pump-1" />);
    expect(markup).toMatch(/data-value="pump-1"[^>]*aria-selected="true"[^>]*data-selected=""/);
    expect(markup).toMatch(/data-value="tank"[^>]*aria-selected="false"/);
  });

  it("marks disabled nodes with aria-disabled and data-disabled", () => {
    const { markup } = renderRoot(<Tree expanded={["hall-1"]} nodes={NODES} />);
    expect(markup).toMatch(/data-value="pump-2"[^>]*aria-disabled="true"[^>]*data-disabled=""/);
  });

  it("shows the icon before the caption, hidden from assistive tech", () => {
    const { markup } = renderRoot(
      <Tree nodes={[{ id: "p", label: "Pump", icon: <svg data-testid="icon" /> }]} />,
    );
    expect(markup).toMatch(
      /<span aria-hidden="true"[^>]*><svg data-testid="icon"><\/svg><\/span><span [^>]*>Pump<\/span>/,
    );
  });

  it("shows the text from the catalog and data-empty on the root element without nodes", () => {
    const { attrs, markup } = renderRoot(<Tree nodes={[]} />);
    expect(attrs["data-empty"]).toBe("");
    expect(markup).toContain("No entries");
    expect(markup).not.toContain('role="tree"');
  });

  it("lets the empty text be overridden", () => {
    expect(renderRoot(<Tree emptyText="No entries here" nodes={[]} />).markup).toContain(
      "No entries here",
    );
  });

  it("passes native attributes through", () => {
    expect(renderRoot(<Tree id="t1" nodes={NODES} />).attrs.id).toBe("t1");
  });
});
