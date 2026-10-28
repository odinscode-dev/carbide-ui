import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ObjectPage } from "./ObjectPage.js";

const TABS = [
  { value: "a", label: "Alpha", content: <p>Alpha content</p> },
  { value: "b", label: "Beta", content: <p>Beta content</p> },
];

describe("ObjectPage", () => {
  it("renders title, facts and the selected tab", () => {
    const markup = renderToStaticMarkup(
      <ObjectPage
        facts={[{ id: "room", label: "Room", value: "Hall 1" }]}
        onTabChange={() => undefined}
        tab="a"
        tabs={TABS}
        title="B-00001"
      />,
    );
    expect(markup).toContain("<h1");
    expect(markup).toContain("B-00001");
    expect(markup).toContain("Room");
    expect(markup).toContain("Hall 1");
    expect(markup).toContain("Alpha");
    expect(markup).toContain("Beta");
  });

  it("renders breadcrumb, status and actions only when given", () => {
    const bare = renderToStaticMarkup(
      <ObjectPage facts={[]} onTabChange={() => undefined} tab="a" tabs={TABS} title="T" />,
    );
    expect(bare).not.toContain("breadcrumb");
    expect(bare).not.toContain("status");
    expect(bare).not.toContain("actions");
    const full = renderToStaticMarkup(
      <ObjectPage
        actions={<button type="button">Edit</button>}
        breadcrumb="Back"
        facts={[]}
        onTabChange={() => undefined}
        status="Active"
        tab="a"
        tabs={TABS}
        title="T"
      />,
    );
    expect(full).toContain("Back");
    expect(full).toContain("Active");
    expect(full).toContain("Edit");
  });

  it("puts the full value of a cut-short fact in its title", () => {
    const markup = renderToStaticMarkup(
      <ObjectPage
        facts={[{ id: "d", label: "Departments", value: "A, B…", title: "A, B, C" }]}
        onTabChange={() => undefined}
        tab="a"
        tabs={TABS}
        title="T"
      />,
    );
    expect(markup).toContain('title="A, B, C"');
  });
});
