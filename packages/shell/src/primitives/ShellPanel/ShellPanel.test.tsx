import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ShellPanel } from "./ShellPanel.js";

describe("ShellPanel", () => {
  it("renders its content in an aside landmark", () => {
    const markup = renderToStaticMarkup(<ShellPanel>Details</ShellPanel>);
    expect(markup).toMatch(/^<aside[^>]*>/);
    expect(markup).toContain("Details");
  });

  it("names itself from the catalog, overridable", () => {
    const defaultLabel = renderToStaticMarkup(<ShellPanel>x</ShellPanel>);
    expect(defaultLabel).toMatch(/^<aside[^>]*aria-label="Panel"/);

    const customLabel = renderToStaticMarkup(<ShellPanel label="Help">x</ShellPanel>);
    expect(customLabel).toMatch(/^<aside[^>]*aria-label="Help"/);
  });

  it("passes native attributes through to the root", () => {
    const markup = renderToStaticMarkup(<ShellPanel data-testid="p" id="panel" />);
    expect(markup).toContain('id="panel"');
    expect(markup).toContain('data-testid="p"');
  });
});
