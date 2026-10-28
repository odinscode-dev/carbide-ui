import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { HomeDashboard } from "./HomeDashboard.js";

describe("HomeDashboard", () => {
  it("renders the content of every tile", () => {
    const markup = renderToStaticMarkup(
      <HomeDashboard
        items={[
          { content: "Overview", id: "a" },
          { content: "Charts", id: "b" },
        ]}
      />,
    );
    expect(markup).toContain("Overview");
    expect(markup).toContain("Charts");
  });

  it("writes each tile's id as a data attribute", () => {
    const markup = renderToStaticMarkup(
      <HomeDashboard items={[{ content: "Overview", id: "moisture" }]} />,
    );
    expect(markup).toContain('data-home-dashboard-item-id="moisture"');
  });

  it("sets column span and row span as custom properties, default one", () => {
    const markup = renderToStaticMarkup(
      <HomeDashboard
        items={[
          { content: "a", id: "a" },
          { columnSpan: 3, content: "b", id: "b", rowSpan: 2 },
        ]}
      />,
    );
    expect(markup).toContain("--carbide-dashboard-item-column-span:1");
    expect(markup).toContain("--carbide-dashboard-item-row-span:1");
    expect(markup).toContain("--carbide-dashboard-item-column-span:3");
    expect(markup).toContain("--carbide-dashboard-item-row-span:2");
  });

  it("passes native attributes through to the root", () => {
    const markup = renderToStaticMarkup(
      <HomeDashboard data-testid="d" id="dashboard" items={[]} />,
    );
    expect(markup).toContain('id="dashboard"');
    expect(markup).toContain('data-testid="d"');
  });
});
