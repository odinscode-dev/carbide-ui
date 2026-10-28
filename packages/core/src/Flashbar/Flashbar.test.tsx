// @vitest-environment jsdom

import { cleanup, fireEvent, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { renderRoot } from "../test/render.js";
import { Flashbar, type FlashbarItem } from "./Flashbar.js";

afterEach(cleanup);

const ITEM: FlashbarItem = {
  id: "1",
  state: "warn",
  title: "Tank level nearing maximum",
  content: "Level is at 92 % of capacity.",
  onDismiss: () => undefined,
};

describe("Flashbar", () => {
  it("renders nothing without entries", () => {
    const { container } = render(<Flashbar items={[]} />);
    expect(container.innerHTML).toBe("");
  });

  it("shows title, text and state of each entry", () => {
    const { markup } = renderRoot(<Flashbar items={[ITEM]} />);
    expect(markup).toContain("Tank level nearing maximum");
    expect(markup).toContain("Level is at 92 % of capacity.");
    expect(markup).toContain('data-state="warn"');
  });

  it("shows multiple entries in order", () => {
    const second: FlashbarItem = { ...ITEM, id: "2", title: "PLC did not answer" };
    const { markup } = renderRoot(<Flashbar items={[ITEM, second]} />);
    expect(markup.indexOf("Tank level nearing maximum")).toBeLessThan(
      markup.indexOf("PLC did not answer"),
    );
  });

  it("shows InlineLoading instead of the status icon when loading is set", () => {
    const loadingItem: FlashbarItem = { ...ITEM, loading: true };
    const { markup } = renderRoot(<Flashbar items={[loadingItem]} />);
    expect(markup).toContain('role="status"');
    expect(markup).toContain('aria-busy="true"');
  });

  it("takes closeText for the accessible name of the close buttons", () => {
    const without = renderRoot(<Flashbar items={[ITEM]} />).markup;
    expect(without).toContain('aria-label="Close"');

    const withCloseText = renderRoot(<Flashbar closeText="Dismiss" items={[ITEM]} />).markup;
    expect(withCloseText).toContain('aria-label="Dismiss"');
  });
});

describe("Flashbar, close button", () => {
  it("calls onDismiss of the clicked entry, not on render", () => {
    const firstDismiss = vi.fn();
    const secondDismiss = vi.fn();
    const second: FlashbarItem = {
      ...ITEM,
      id: "2",
      title: "PLC did not answer",
      onDismiss: secondDismiss,
    };
    const entries = [{ ...ITEM, onDismiss: firstDismiss }, second];

    const { getAllByRole } = render(<Flashbar items={entries} />);
    expect(firstDismiss).not.toHaveBeenCalled();
    expect(secondDismiss).not.toHaveBeenCalled();

    const [, secondButton] = getAllByRole("button");
    expect(secondButton).toBeDefined();
    if (secondButton !== undefined) {
      fireEvent.click(secondButton);
    }
    expect(firstDismiss).not.toHaveBeenCalled();
    expect(secondDismiss).toHaveBeenCalledOnce();
  });
});
