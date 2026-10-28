import { describe, expect, it } from "vitest";
import { renderRoot } from "../test/render.js";
import { List } from "./List.js";

describe("List", () => {
  it("renders a ul by default, without data-ordered", () => {
    const { tag, attrs } = renderRoot(
      <List>
        <li>One</li>
      </List>,
    );
    expect(tag).toBe("ul");
    expect(attrs).not.toHaveProperty("data-ordered");
  });

  it("renders an ol with data-ordered when ordered is set", () => {
    const { tag, attrs } = renderRoot(
      <List ordered>
        <li>One</li>
      </List>,
    );
    expect(tag).toBe("ol");
    expect(attrs["data-ordered"]).toBe("");
  });

  it("renders custom children unchanged", () => {
    const { markup } = renderRoot(
      <List>
        <li>Pump P-1</li>
        <li>Pump P-2</li>
      </List>,
    );
    expect(markup.match(/<li/g)).toHaveLength(2);
    expect(markup).toContain("Pump P-1");
  });

  it("builds entries from items, with the content as text", () => {
    const { markup } = renderRoot(
      <List items={[{ content: "Plants" }, { content: "North Plant" }]} />,
    );
    expect(markup.match(/<li/g)).toHaveLength(2);
    expect(markup).toContain("Plants");
    expect(markup).toContain("North Plant");
  });

  it("nests another list under an entry with its own items", () => {
    const { markup } = renderRoot(
      <List
        items={[
          {
            content: "North Plant",
            items: [{ content: "Hall 1" }, { content: "Hall 2" }],
          },
        ]}
      />,
    );
    expect(markup.match(/<li/g)).toHaveLength(3);
    expect(markup.match(/<ul/g)).toHaveLength(2);
  });

  it("passes native attributes through", () => {
    expect(
      renderRoot(
        <List id="l1">
          <li>One</li>
        </List>,
      ).attrs.id,
    ).toBe("l1");
  });
});
