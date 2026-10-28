import { describe, expect, it } from "vitest";
import { renderRoot } from "../test/render.js";
import type { CodeSnippetLanguage } from "./CodeSnippet.js";
import { CodeSnippet } from "./CodeSnippet.js";

const TEN_LINES = Array.from({ length: 10 }, (_, index) => `line ${index + 1}`).join("\n");
const ELEVEN_LINES = `${TEN_LINES}\nline 11`;

describe("CodeSnippet", () => {
  it("is single-line by default: data-type single, the code in one pre", () => {
    const { tag, attrs, markup } = renderRoot(<CodeSnippet code="pnpm test" />);
    expect(tag).toBe("div");
    expect(attrs["data-type"]).toBe("single");
    expect(markup).toMatch(/<pre [^>]*>pnpm test<\/pre>/);
  });

  it("writes the type as data-type on the root element", () => {
    expect(renderRoot(<CodeSnippet code="x" type="multi" />).attrs["data-type"]).toBe("multi");
  });

  it("has a copy button with the name from the catalog and no data-copied at first", () => {
    const { attrs, markup } = renderRoot(<CodeSnippet code="x" />);
    expect(attrs).not.toHaveProperty("data-copied");
    expect(markup).toMatch(/<button [^>]*aria-label="Copy"/);
    expect(markup).toContain(">Copied</span>");
  });

  it("lets the copy texts be overridden", () => {
    const { markup } = renderRoot(
      <CodeSnippet code="x" copiedText="Copied it" copyText="Copy it" />,
    );
    expect(markup).toContain('aria-label="Copy it"');
    expect(markup).toContain(">Copied it</span>");
  });

  it("collapses from eleven lines on: data-state collapsed and a Show more button", () => {
    const { attrs, markup } = renderRoot(
      <CodeSnippet code={ELEVEN_LINES} collapsible type="multi" />,
    );
    expect(attrs["data-state"]).toBe("collapsed");
    expect(markup).toMatch(/<button [^>]*aria-expanded="false"[^>]*>Show more/);
  });

  it("does not collapse at ten lines or fewer, even with collapsible", () => {
    const { attrs, markup } = renderRoot(<CodeSnippet code={TEN_LINES} collapsible type="multi" />);
    expect(attrs).not.toHaveProperty("data-state");
    expect(markup).not.toContain("Show more");
  });

  it("does not count a trailing line break as a line", () => {
    const { attrs } = renderRoot(<CodeSnippet code={`${TEN_LINES}\n`} collapsible type="multi" />);
    expect(attrs).not.toHaveProperty("data-state");
  });

  it("never collapses when single-line", () => {
    expect(renderRoot(<CodeSnippet code={ELEVEN_LINES} collapsible />).attrs).not.toHaveProperty(
      "data-state",
    );
  });

  it("connects the collapse button to the block via aria-controls", () => {
    const { markup } = renderRoot(<CodeSnippet code={ELEVEN_LINES} collapsible type="multi" />);
    const id = /<pre [^>]*id="([^"]+)"/.exec(markup)?.[1];
    expect(id).toBeDefined();
    expect(markup).toContain(`aria-controls="${id}"`);
  });

  it("lets the collapse button text be overridden", () => {
    const { markup } = renderRoot(
      <CodeSnippet code={ELEVEN_LINES} collapsible showMoreText="More" type="multi" />,
    );
    expect(markup).toMatch(/aria-expanded="false"[^>]*>More/);
  });

  it("passes native attributes through", () => {
    expect(renderRoot(<CodeSnippet code="x" id="c1" />).attrs.id).toBe("c1");
  });

  it("stays unformatted without a language", () => {
    const { markup } = renderRoot(<CodeSnippet code="const x = 1;" />);
    expect(markup).not.toContain('class="token');
    expect(markup).toContain(">const x = 1;<");
  });

  it("colors the code via token classes when a language is given", () => {
    const { markup } = renderRoot(<CodeSnippet code="const x = 1;" language="tsx" />);
    expect(markup).toContain('class="token keyword">const<');
  });

  it("knows html as its own language, even though refractor calls it markup", () => {
    const { markup } = renderRoot(<CodeSnippet code='<a href="x">i</a>' language="html" />);
    expect(markup).toContain('class="token tag"');
  });

  it("highlights each of the eight predefined languages without throwing", () => {
    const examples: [CodeSnippetLanguage, string][] = [
      ["bash", "echo hi"],
      ["css", "a { color: red; }"],
      ["go", 'package main\nfunc main() { println("hi") }'],
      ["html", "<p>hi</p>"],
      ["json", '{"a": 1}'],
      ["sql", "SELECT 1;"],
      ["tsx", "const a = 1;"],
      ["yaml", "a: 1"],
    ];
    expect(examples).toHaveLength(8);
    for (const [language, code] of examples) {
      const { markup } = renderRoot(<CodeSnippet code={code} language={language} />);
      expect(markup, language).toContain('class="token');
    }
  });
});
