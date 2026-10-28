import { describe, expect, it } from "vitest";
import { joinClassNames } from "./joinClassNames.js";

describe("joinClassNames", () => {
  it("joins the class names in the order given", () => {
    expect(joinClassNames("own", "mine")).toBe("own mine");
  });

  it("skips missing and empty names", () => {
    expect(joinClassNames("own", undefined, "", "mine")).toBe("own mine");
  });

  it("returns the single name unchanged", () => {
    expect(joinClassNames("own", undefined)).toBe("own");
  });

  it("returns undefined when nothing is left", () => {
    expect(joinClassNames(undefined, "")).toBeUndefined();
    expect(joinClassNames()).toBeUndefined();
  });
});
