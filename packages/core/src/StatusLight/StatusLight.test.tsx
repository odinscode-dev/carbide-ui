// @vitest-environment jsdom

import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { StatusLight } from "./StatusLight.js";

afterEach(cleanup);

describe("StatusLight", () => {
  it("is an image named by its label, with tone and pulse on the root", () => {
    render(<StatusLight label="Sensor online" pulse tone="ok" />);
    const light = screen.getByRole("img", { name: "Sensor online" });
    expect(light.dataset.tone).toBe("ok");
    expect(light.dataset.pulse).toBe("");
    expect(light.title).toBe("Sensor online");
  });

  it("does not pulse by default and lets the tooltip be replaced", () => {
    render(<StatusLight label="Offline" title="Last seen 10 min ago" tone="alarm" />);
    const light = screen.getByRole("img", { name: "Offline" });
    expect(light.dataset.pulse).toBeUndefined();
    expect(light.title).toBe("Last seen 10 min ago");
  });
});
