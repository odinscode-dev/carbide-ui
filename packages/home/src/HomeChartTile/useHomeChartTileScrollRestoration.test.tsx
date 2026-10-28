// @vitest-environment jsdom

import { cleanup, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useHomeChartTileScrollRestoration } from "./useHomeChartTileScrollRestoration.js";

class FakeIntersectionObserver implements IntersectionObserver {
  static instances: FakeIntersectionObserver[] = [];
  readonly root = null;
  readonly rootMargin = "";
  readonly thresholds: readonly number[] = [];
  observed: Element[] = [];
  callback: IntersectionObserverCallback;

  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback;
    FakeIntersectionObserver.instances.push(this);
  }

  observe(target: Element): void {
    this.observed.push(target);
  }

  unobserve(): void {}
  disconnect(): void {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }

  fire(entries: IntersectionObserverEntry[]) {
    this.callback(entries, this);
  }
}

function entry(
  target: Element,
  isIntersecting: boolean,
  intersectionRatio: number,
): IntersectionObserverEntry {
  const bounds = target.getBoundingClientRect();
  return {
    target,
    isIntersecting,
    intersectionRatio,
    boundingClientRect: bounds,
    intersectionRect: bounds,
    rootBounds: null,
    time: 0,
  };
}

let orientationListener: (() => void) | undefined;

function Wrapper() {
  useHomeChartTileScrollRestoration();
  return null;
}

beforeEach(() => {
  FakeIntersectionObserver.instances = [];
  orientationListener = undefined;
  vi.stubGlobal("IntersectionObserver", FakeIntersectionObserver);
  vi.stubGlobal(
    "matchMedia",
    vi.fn().mockReturnValue({
      matches: true,
      addEventListener: (_event: string, listener: () => void) => {
        orientationListener = listener;
      },
      removeEventListener: () => {
        orientationListener = undefined;
      },
    }),
  );
  Element.prototype.scrollIntoView = vi.fn();
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("useHomeChartTileScrollRestoration", () => {
  it("observes every tile with data-home-chart-tile-id", () => {
    render(
      <div>
        <div data-home-chart-tile-id="a" />
        <div data-home-chart-tile-id="b" />
        <Wrapper />
      </div>,
    );

    const observer = FakeIntersectionObserver.instances[0];
    expect(observer?.observed).toHaveLength(2);
  });

  it("scrolls the last visible tile into view after rotation, not the other one", () => {
    const { container } = render(
      <div>
        <div data-home-chart-tile-id="a" />
        <div data-home-chart-tile-id="b" />
        <Wrapper />
      </div>,
    );
    const a = container.querySelector('[data-home-chart-tile-id="a"]');
    const b = container.querySelector('[data-home-chart-tile-id="b"]');
    if (a === null || b === null) throw new Error("Tiles not found.");

    a.scrollIntoView = vi.fn();
    b.scrollIntoView = vi.fn();

    const observer = FakeIntersectionObserver.instances[0];
    observer?.fire([entry(a, true, 0.9), entry(b, true, 0.3)]);

    orientationListener?.();

    expect(a.scrollIntoView).toHaveBeenCalledExactlyOnceWith({
      block: "start",
      behavior: "instant",
    });
    expect(b.scrollIntoView).not.toHaveBeenCalled();
  });

  it("drops a tile that is no longer visible and then scrolls none", () => {
    const { container } = render(
      <div>
        <div data-home-chart-tile-id="a" />
        <Wrapper />
      </div>,
    );
    const a = container.querySelector('[data-home-chart-tile-id="a"]');
    if (a === null) throw new Error("Tile not found.");

    const observer = FakeIntersectionObserver.instances[0];
    observer?.fire([entry(a, true, 0.8)]);
    observer?.fire([entry(a, false, 0)]);

    orientationListener?.();

    expect(a.scrollIntoView).not.toHaveBeenCalled();
  });

  it("reports no error when IntersectionObserver or matchMedia are missing", () => {
    vi.stubGlobal("IntersectionObserver", undefined);
    vi.stubGlobal("matchMedia", undefined);

    expect(() =>
      render(
        <div>
          <Wrapper />
        </div>,
      ),
    ).not.toThrow();
  });
});
