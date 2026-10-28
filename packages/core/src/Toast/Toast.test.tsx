// @vitest-environment jsdom

import { cleanup, render, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Toaster, toast } from "./Toast.js";

afterEach(cleanup);

describe("toast and Toaster", () => {
  it("returns an id and shows the message, default info", async () => {
    const id = toast("New firmware available");
    expect(typeof id).toBe("string");
    expect(id.length).toBeGreaterThan(0);

    render(<Toaster />);
    await waitFor(() => expect(document.querySelector('[data-state="info"]')).not.toBeNull());
    expect(document.querySelector('[data-state="info"]')?.textContent).toContain(
      "New firmware available",
    );
  });

  it("adopts the given state", async () => {
    toast("Recipe written", { state: "success" });
    render(<Toaster />);
    await waitFor(() => expect(document.querySelector('[data-state="success"]')).not.toBeNull());
  });

  it("shows the action when one is given", async () => {
    toast("Tank level nearing maximum", {
      state: "warn",
      action: { label: "Acknowledge", onClick: () => undefined },
    });
    const { getByText } = render(<Toaster />);
    await waitFor(() => expect(getByText("Acknowledge")).toBeTruthy());
  });
});
