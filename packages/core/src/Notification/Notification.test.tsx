// @vitest-environment jsdom

import { cleanup, fireEvent, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { renderRoot } from "../test/render.js";
import { Notification } from "./Notification.js";

afterEach(cleanup);

describe("Notification", () => {
  it("renders in state info by default, without a close button", () => {
    const { tag, attrs, markup } = renderRoot(<Notification>Message</Notification>);
    expect(tag).toBe("div");
    expect(attrs["data-state"]).toBe("info");
    expect(attrs.role).toBe("status");
    expect(markup).toContain("Message");
    expect(markup).not.toContain("<button");
  });

  it("writes every state as data-state on the root element", () => {
    expect(renderRoot(<Notification state="success">M</Notification>).attrs["data-state"]).toBe(
      "success",
    );
    expect(renderRoot(<Notification state="warn">M</Notification>).attrs["data-state"]).toBe(
      "warn",
    );
    expect(renderRoot(<Notification state="critical">M</Notification>).attrs["data-state"]).toBe(
      "critical",
    );
    expect(renderRoot(<Notification state="error">M</Notification>).attrs["data-state"]).toBe(
      "error",
    );
  });

  it("shows the title only when it is given", () => {
    expect(renderRoot(<Notification title="Heading">Message</Notification>).markup).toContain(
      "Heading",
    );
    expect(renderRoot(<Notification>Message</Notification>).markup).not.toContain("<p ");
  });

  it("shows the close button only with onClose, its text overridable from the catalog", () => {
    const withOnClose = renderRoot(<Notification onClose={() => undefined}>M</Notification>);
    expect(withOnClose.markup).toContain("<button");
    expect(withOnClose.markup).toContain('aria-label="Close"');

    const overridden = renderRoot(
      <Notification closeText="Dismiss" onClose={() => undefined}>
        M
      </Notification>,
    );
    expect(overridden.markup).toContain('aria-label="Dismiss"');
  });

  it("passes native attributes through", () => {
    expect(renderRoot(<Notification id="n1">M</Notification>).attrs.id).toBe("n1");
  });
});

describe("Notification, close button", () => {
  it("calls onClose only on click, not on render", () => {
    const onClose = vi.fn();
    const { getByRole } = render(<Notification onClose={onClose}>M</Notification>);
    expect(onClose).not.toHaveBeenCalled();

    fireEvent.click(getByRole("button"));
    expect(onClose).toHaveBeenCalledOnce();
  });
});
