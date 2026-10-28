// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { createRef } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { renderRoot } from "../test/render.js";
import { Button } from "./Button.js";

describe("Button", () => {
  it("renders a button with the text, default secondary without state", () => {
    const { tag, attrs, markup } = renderRoot(<Button>Acknowledge</Button>);
    expect(tag).toBe("button");
    expect(attrs.type).toBe("button");
    expect(attrs["data-variant"]).toBe("secondary");
    expect(attrs).not.toHaveProperty("data-disabled");
    expect(attrs).not.toHaveProperty("data-loading");
    expect(attrs).not.toHaveProperty("data-icon-only");
    expect(markup).toContain("Acknowledge");
  });

  it("writes variant as data-variant on the root element", () => {
    expect(renderRoot(<Button variant="primary">x</Button>).attrs["data-variant"]).toBe("primary");
    expect(renderRoot(<Button variant="danger">x</Button>).attrs["data-variant"]).toBe("danger");
  });

  it("locked: native disabled and data-disabled on the root element", () => {
    const { attrs } = renderRoot(<Button disabled>x</Button>);
    expect(attrs).toHaveProperty("disabled");
    expect(attrs["data-disabled"]).toBe("");
  });

  it("loading: data-loading, data-disabled, aria-busy and a dot instead of an icon", () => {
    const { attrs, markup } = renderRoot(
      <Button icon={<svg data-testid="icon" />} loading>
        x
      </Button>,
    );
    expect(attrs["data-loading"]).toBe("");
    expect(attrs["data-disabled"]).toBe("");
    expect(attrs["aria-busy"]).toBe("true");
    expect(attrs).toHaveProperty("disabled");
    expect(markup).not.toContain('data-testid="icon"');
  });

  it("no aria-busy without loading", () => {
    expect(renderRoot(<Button>x</Button>).attrs).not.toHaveProperty("aria-busy");
  });

  it("shows the icon without a label as data-icon-only", () => {
    const { attrs } = renderRoot(<Button icon={<svg />} />);
    expect(attrs["data-icon-only"]).toBe("");
  });

  it("has no data-icon-only with a label, even with an icon", () => {
    expect(renderRoot(<Button icon={<svg />}>x</Button>).attrs).not.toHaveProperty(
      "data-icon-only",
    );
  });

  it("iconPosition appears as data-icon-position only with an icon, default end", () => {
    expect(renderRoot(<Button icon={<svg />}>x</Button>).attrs["data-icon-position"]).toBe("end");
    expect(
      renderRoot(
        <Button icon={<svg />} iconPosition="start">
          x
        </Button>,
      ).attrs["data-icon-position"],
    ).toBe("start");
    expect(renderRoot(<Button>x</Button>).attrs).not.toHaveProperty("data-icon-position");
  });

  it("passes native button attributes through", () => {
    const { attrs } = renderRoot(
      <Button id="save" type="submit">
        x
      </Button>,
    );
    expect(attrs.id).toBe("save");
    expect(attrs.type).toBe("submit");
  });
});

describe("Button, click", () => {
  afterEach(cleanup);

  it("triggers onClick on click", async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Acknowledge</Button>);
    fireEvent.click(screen.getByRole("button", { name: "Acknowledge" }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("locked: no onClick on click", () => {
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        x
      </Button>,
    );
    fireEvent.click(screen.getByRole("button"));
    expect(onClick).not.toHaveBeenCalled();
  });

  it("loading: no onClick on click", () => {
    const onClick = vi.fn();
    render(
      <Button loading onClick={onClick}>
        x
      </Button>,
    );
    fireEvent.click(screen.getByRole("button"));
    expect(onClick).not.toHaveBeenCalled();
  });

  it("forwards ref to the native button element", () => {
    const ref = createRef<HTMLButtonElement>();
    render(<Button ref={ref}>x</Button>);
    expect(ref.current).toBe(screen.getByRole("button", { name: "x" }));
  });
});
