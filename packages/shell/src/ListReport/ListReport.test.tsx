import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ListReport } from "./ListReport.js";

describe("ListReport", () => {
  it("renders title, filters and content", () => {
    const markup = renderToStaticMarkup(
      <ListReport filters={<span>Filter bar</span>} title="Batches">
        <p>Rows</p>
      </ListReport>,
    );
    expect(markup).toContain("<h1");
    expect(markup).toContain("Batches");
    expect(markup).toContain("Filter bar");
    expect(markup).toContain("Rows");
  });

  it("renders meta and actions only when given", () => {
    const bare = renderToStaticMarkup(
      <ListReport filters={null} title="Batches">
        x
      </ListReport>,
    );
    expect(bare).not.toContain("meta");
    expect(bare).not.toContain("actions");
    const full = renderToStaticMarkup(
      <ListReport actions={<button type="button">New</button>} filters={null} meta="40" title="B">
        x
      </ListReport>,
    );
    expect(full).toContain("meta");
    expect(full).toContain("New");
  });
});
