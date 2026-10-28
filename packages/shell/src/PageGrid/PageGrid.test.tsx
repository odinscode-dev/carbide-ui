import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { PageContainer } from "../PageContainer/index.js";
import { PageGrid } from "./PageGrid.js";

describe("PageGrid", () => {
  it("renders its children", () => {
    const markup = renderToStaticMarkup(<PageGrid>Content</PageGrid>);
    expect(markup).toContain("Content");
  });

  it("flows by default and fills with fill", () => {
    expect(renderToStaticMarkup(<PageGrid />)).not.toContain("data-fill");
    expect(renderToStaticMarkup(<PageGrid fill />)).toContain("data-fill");
  });

  it("passes native attributes through", () => {
    expect(renderToStaticMarkup(<PageGrid id="grid" />)).toContain('id="grid"');
  });
});

describe("PageContainer", () => {
  it("spans the given number of columns", () => {
    const markup = renderToStaticMarkup(<PageContainer span={10}>Content</PageContainer>);
    expect(markup).toContain("grid-column:span 10");
    expect(markup).toContain("Content");
  });

  it("takes a fixed block size", () => {
    const markup = renderToStaticMarkup(
      <PageContainer span={6} blockSize="12rem">
        x
      </PageContainer>,
    );
    expect(markup).toContain("block-size:12rem");
  });

  it("does not set a block size without one", () => {
    expect(renderToStaticMarkup(<PageContainer span={6}>x</PageContainer>)).not.toContain(
      "block-size",
    );
  });
});
