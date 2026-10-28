import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ShellMain } from "./ShellMain.js";

describe("ShellMain", () => {
  it("renders its content in a main landmark", () => {
    const markup = renderToStaticMarkup(<ShellMain>Overview</ShellMain>);
    expect(markup).toMatch(/^<main[^>]*>/);
    expect(markup).toContain("Overview");
  });

  it("passes native attributes through to the root", () => {
    const markup = renderToStaticMarkup(<ShellMain data-testid="m" id="main" />);
    expect(markup).toContain('id="main"');
    expect(markup).toContain('data-testid="m"');
  });

  it("scrolls its content by default", () => {
    const markup = renderToStaticMarkup(<ShellMain>Overview</ShellMain>);
    expect(markup).toContain('data-layout="scroll"');
    expect(markup).toContain('data-scope="scroll-area"');
  });

  it("fills the main area without a scroll area with layout fill", () => {
    const markup = renderToStaticMarkup(<ShellMain layout="fill">Overview</ShellMain>);
    expect(markup).toContain('data-layout="fill"');
    expect(markup).not.toContain('data-scope="scroll-area"');
    expect(markup).toContain("Overview");
  });
});
