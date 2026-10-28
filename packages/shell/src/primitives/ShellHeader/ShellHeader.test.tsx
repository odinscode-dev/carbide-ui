// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import type { ReactElement } from "react";
import { createRef } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ShellHeader } from "./ShellHeader.js";

function header(element: ReactElement): { tag: string; markup: string } {
  const markup = renderToStaticMarkup(element);
  const match = /^<header[^>]*>/.exec(markup);
  if (match === null) {
    throw new Error(`No header in markup: ${markup}`);
  }
  return { tag: match[0], markup };
}

describe("ShellHeader", () => {
  it("renders the title", () => {
    const { markup } = header(<ShellHeader title="Plant 3" />);
    expect(markup).toContain("Plant 3");
  });

  it("shows the context line only with a context prop and reports it as data-context", () => {
    const withProp = header(<ShellHeader context="Line 2" title="Plant 3" />);
    expect(withProp.tag).toContain("data-context");
    expect(withProp.markup).toContain("Line 2");

    const withoutProp = header(<ShellHeader title="Plant 3" />);
    expect(withoutProp.tag).not.toContain("data-context");
  });

  it("shows the status strip only with a status prop and reports it as data-status", () => {
    const withProp = header(<ShellHeader status={<span>7 flagged</span>} title="Plant 3" />);
    expect(withProp.tag).toContain("data-status");
    expect(withProp.markup).toContain("7 flagged");

    const withoutProp = header(<ShellHeader title="Plant 3" />);
    expect(withoutProp.tag).not.toContain("data-status");
  });

  it("shows actions only with an actions prop and reports them as data-actions", () => {
    const withProp = header(<ShellHeader actions={<span>Export</span>} title="Plant 3" />);
    expect(withProp.tag).toContain("data-actions");
    expect(withProp.markup).toContain("Export");

    const withoutProp = header(<ShellHeader title="Plant 3" />);
    expect(withoutProp.tag).not.toContain("data-actions");
  });

  it("shows the menu button only with onMenuClick and reports it as data-menu", () => {
    const withProp = header(<ShellHeader onMenuClick={() => {}} title="Plant 3" />);
    expect(withProp.tag).toContain("data-menu");
    expect(withProp.markup).toMatch(/<button[^>]*aria-label="Menu"/);

    const withoutProp = header(<ShellHeader title="Plant 3" />);
    expect(withoutProp.tag).not.toContain("data-menu");
    expect(withoutProp.markup).not.toContain("<button");
  });

  it("lets the menu button's name be overridden", () => {
    const { markup } = header(
      <ShellHeader menuText="Open menu" onMenuClick={() => {}} title="Plant 3" />,
    );
    expect(markup).toMatch(/aria-label="Open menu"/);
  });

  it("reports menuOpen as aria-expanded, default false", () => {
    const closedHeader = header(<ShellHeader onMenuClick={() => {}} title="Plant 3" />);
    expect(closedHeader.markup).toMatch(/<button[^>]*aria-expanded="false"/);

    const openHeader = header(<ShellHeader menuOpen onMenuClick={() => {}} title="Plant 3" />);
    expect(openHeader.markup).toMatch(/<button[^>]*aria-expanded="true"/);
  });
});

describe("ShellHeader, click", () => {
  afterEach(cleanup);

  it("calls onMenuClick on a click on the menu button", () => {
    const onMenuClick = vi.fn();
    render(<ShellHeader onMenuClick={onMenuClick} title="Plant 3" />);
    fireEvent.click(screen.getByRole("button", { name: "Menu" }));
    expect(onMenuClick).toHaveBeenCalledOnce();
  });

  it("forwards menuButtonRef to the menu button", () => {
    const ref = createRef<HTMLButtonElement>();
    render(<ShellHeader menuButtonRef={ref} onMenuClick={() => {}} title="Plant 3" />);
    expect(ref.current).toBe(screen.getByRole("button", { name: "Menu" }));
  });
});

describe("ShellHeader: cut text stays readable", () => {
  it("gives a text title and context line as their title, so a cut line has its full text", () => {
    const { markup } = header(
      <ShellHeader context="Plants › Greenhouse north › Pump station 2" title="Plant 3" />,
    );
    expect(markup).toContain('title="Plants › Greenhouse north › Pump station 2"');
    expect(markup).toContain('title="Plant 3"');
  });

  it("gives no title to a title that is not text", () => {
    const { markup } = header(<ShellHeader context={<b>Line 2</b>} title={<i>Plant 3</i>} />);
    expect(markup).not.toContain("title=");
  });
});
