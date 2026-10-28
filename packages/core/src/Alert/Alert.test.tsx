// @vitest-environment jsdom

import { cleanup, fireEvent, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { renderRoot } from "../test/render.js";
import { Alert } from "./Alert.js";

afterEach(cleanup);

describe("Alert", () => {
  it("renders in state info by default, as role alert", () => {
    const { tag, attrs, markup } = renderRoot(<Alert>Message</Alert>);
    expect(tag).toBe("div");
    expect(attrs["data-state"]).toBe("info");
    expect(attrs.role).toBe("alert");
    expect(markup).toContain("Message");
  });

  it("writes every state as data-state on the root element", () => {
    expect(renderRoot(<Alert state="success">M</Alert>).attrs["data-state"]).toBe("success");
    expect(renderRoot(<Alert state="warn">M</Alert>).attrs["data-state"]).toBe("warn");
    expect(renderRoot(<Alert state="critical">M</Alert>).attrs["data-state"]).toBe("critical");
    expect(renderRoot(<Alert state="error">M</Alert>).attrs["data-state"]).toBe("error");
  });

  it("shows the title only when it is given", () => {
    expect(renderRoot(<Alert title="Heading">Message</Alert>).markup).toContain("Heading");
    expect(renderRoot(<Alert>Message</Alert>).markup).not.toContain("<p ");
  });

  it("shows the action only when one is given, and never a close button", () => {
    expect(renderRoot(<Alert>M</Alert>).markup).not.toContain("<button");

    const withAction = renderRoot(
      <Alert action={{ label: "Reduce now", onClick: () => undefined }}>M</Alert>,
    );
    expect(withAction.markup).toContain("Reduce now");
    expect(withAction.markup).toContain("<button");
  });

  it("passes native attributes through", () => {
    expect(renderRoot(<Alert id="a1">M</Alert>).attrs.id).toBe("a1");
  });
});

describe("Alert, action button", () => {
  it("calls onClick only on click, not on render", () => {
    const onClick = vi.fn();
    const { getByRole } = render(<Alert action={{ label: "Reduce now", onClick }}>M</Alert>);
    expect(onClick).not.toHaveBeenCalled();

    fireEvent.click(getByRole("button", { name: "Reduce now" }));
    expect(onClick).toHaveBeenCalledOnce();
  });
});
