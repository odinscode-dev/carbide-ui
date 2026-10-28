// @vitest-environment jsdom

import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { renderRoot } from "../test/render.js";
import { IconChip } from "./IconChip.js";

afterEach(cleanup);

describe("IconChip", () => {
  it("is decoration without a label", () => {
    const { attrs } = renderRoot(<IconChip icon={<svg />} />);
    expect(attrs["aria-hidden"]).toBe("true");
    expect(attrs["data-size"]).toBe("md");
    expect(attrs).not.toHaveProperty("role");
  });

  it("is an image named by its label, its colour a custom property", () => {
    render(<IconChip color="red" icon={<svg />} label="Humidity" size="sm" />);
    const chip = screen.getByRole("img", { name: "Humidity" });
    expect(chip.dataset.size).toBe("sm");
    expect(chip.style.getPropertyValue("--carbide-chip-color")).toBe("red");
  });
});
