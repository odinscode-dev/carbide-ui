import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { HomeMain } from "./HomeMain.js";

describe("HomeMain", () => {
  it("renders its content in a main landmark", () => {
    const markup = renderToStaticMarkup(<HomeMain>Overview</HomeMain>);
    expect(markup).toMatch(/^<main[^>]*>/);
    expect(markup).toContain("Overview");
  });

  it("passes native attributes through to the root", () => {
    const markup = renderToStaticMarkup(<HomeMain data-testid="m" id="main" />);
    expect(markup).toContain('id="main"');
    expect(markup).toContain('data-testid="m"');
  });
});
