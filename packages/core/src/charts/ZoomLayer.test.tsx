// @vitest-environment jsdom

import { cleanup, fireEvent, render } from "@testing-library/react";
import { ComposedChart, Line, XAxis, YAxis } from "recharts";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ZoomLayer } from "./ZoomLayer.js";
import type { ChartDomain, ZoomLimits } from "./zoom.js";

const LIMITS: ZoomLimits = { full: [0, 1000], minSpan: 10 };
const DATA = [
  { at: 0, value: 1 },
  { at: 1000, value: 2 },
];

// jsdom has neither pointer events with their fields nor pointer capture.
class TestPointerEvent extends MouseEvent {
  readonly pointerId: number;
  readonly pointerType: string;

  constructor(type: string, init: MouseEventInit & { pointerId?: number; pointerType?: string }) {
    super(type, { bubbles: true, cancelable: true, ...init });
    this.pointerId = init.pointerId ?? 0;
    this.pointerType = init.pointerType ?? "mouse";
  }
}

beforeEach(() => {
  vi.stubGlobal("PointerEvent", TestPointerEvent);
  Element.prototype.setPointerCapture = () => {};
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

function mount(shown: ChartDomain, onCommit = vi.fn(), onLive = vi.fn()) {
  const { container } = render(
    <ComposedChart
      data={DATA}
      height={200}
      margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
      width={600}
    >
      <XAxis dataKey="at" domain={[shown[0], shown[1]]} hide type="number" />
      <YAxis hide />
      <Line dataKey="value" />
      <ZoomLayer limits={LIMITS} onCommit={onCommit} onLive={onLive} shown={shown} />
    </ComposedChart>,
  );
  const rect = container.querySelector('rect[fill="transparent"]');
  if (rect === null) {
    throw new Error("no zoom layer");
  }
  return {
    rect,
    onCommit,
    onLive,
    x: Number(rect.getAttribute("x")),
    width: Number(rect.getAttribute("width")),
  };
}

const pointer = (type: string, id: number, x: number) => ({
  pointerId: id,
  pointerType: type,
  button: 0,
  clientX: x,
});

describe("ZoomLayer", () => {
  it("covers the plot area", () => {
    const { width } = mount([0, 1000]);
    expect(width).toBe(600);
  });

  it("zooms to the stretch a mouse drags out", () => {
    const { rect, onCommit, x, width } = mount([0, 1000]);
    fireEvent.pointerDown(rect, pointer("mouse", 1, x + width * 0.2));
    fireEvent.pointerMove(rect, pointer("mouse", 1, x + width * 0.6));
    fireEvent.pointerUp(rect, pointer("mouse", 1, x + width * 0.6));
    expect(onCommit).toHaveBeenCalledOnce();
    const [from, to] = onCommit.mock.calls[0]?.[0] ?? [];
    expect(from).toBeCloseTo(200, 5);
    expect(to).toBeCloseTo(600, 5);
  });

  it("drags from right to left just the same", () => {
    const { rect, onCommit, x, width } = mount([0, 1000]);
    fireEvent.pointerDown(rect, pointer("mouse", 1, x + width * 0.6));
    fireEvent.pointerMove(rect, pointer("mouse", 1, x + width * 0.2));
    fireEvent.pointerUp(rect, pointer("mouse", 1, x + width * 0.2));
    const [from, to] = onCommit.mock.calls[0]?.[0] ?? [];
    expect(from).toBeCloseTo(200, 5);
    expect(to).toBeCloseTo(600, 5);
  });

  it("takes a click for a click, not for a selection", () => {
    const { rect, onCommit, x } = mount([0, 1000]);
    fireEvent.pointerDown(rect, pointer("mouse", 1, x + 100));
    fireEvent.pointerUp(rect, pointer("mouse", 1, x + 103));
    expect(onCommit).not.toHaveBeenCalled();
  });

  it("does nothing for another mouse button", () => {
    const { rect, onCommit, x } = mount([0, 1000]);
    fireEvent.pointerDown(rect, { ...pointer("mouse", 1, x + 100), button: 2 });
    fireEvent.pointerMove(rect, pointer("mouse", 1, x + 300));
    fireEvent.pointerUp(rect, pointer("mouse", 1, x + 300));
    expect(onCommit).not.toHaveBeenCalled();
  });

  it("drops a drag that is cancelled", () => {
    const { rect, onCommit, x } = mount([0, 1000]);
    fireEvent.pointerDown(rect, pointer("mouse", 1, x + 100));
    fireEvent.pointerMove(rect, pointer("mouse", 1, x + 300));
    fireEvent.pointerCancel(rect, pointer("mouse", 1, x + 300));
    expect(onCommit).not.toHaveBeenCalled();
  });

  it("moves the shown stretch with a swipe, and keeps it when the finger lifts", () => {
    const { rect, onCommit, onLive, x, width } = mount([200, 600]);
    fireEvent.pointerDown(rect, pointer("touch", 1, x + width * 0.5));
    fireEvent.pointerMove(rect, pointer("touch", 1, x + width * 0.25));
    const live = onLive.mock.calls.at(-1)?.[0];
    expect(live[0]).toBeCloseTo(300, 5);
    expect(live[1]).toBeCloseTo(700, 5);
    fireEvent.pointerUp(rect, pointer("touch", 1, x + width * 0.25));
    expect(onCommit).toHaveBeenCalledOnce();
    expect(onCommit.mock.calls[0]?.[0][0]).toBeCloseTo(300, 5);
  });

  it("widens the stretch when two fingers pinch together, around their middle", () => {
    const { rect, onCommit, onLive, x, width } = mount([200, 600]);
    const middle = x + width * 0.5;
    fireEvent.pointerDown(rect, pointer("touch", 1, middle - 100));
    fireEvent.pointerDown(rect, pointer("touch", 2, middle + 100));
    fireEvent.pointerMove(rect, pointer("touch", 1, middle - 50));
    fireEvent.pointerMove(rect, pointer("touch", 2, middle + 50));
    const live = onLive.mock.calls.at(-1)?.[0];
    expect(live[1] - live[0]).toBeCloseTo(800, 5);
    expect((live[0] + live[1]) / 2).toBeCloseTo(400, 5);
    fireEvent.pointerUp(rect, pointer("touch", 2, middle + 50));
    expect(onCommit).toHaveBeenCalledOnce();
    fireEvent.pointerUp(rect, pointer("touch", 1, middle - 50));
    expect(onCommit).toHaveBeenCalledOnce();
  });

  it("narrows the stretch when two fingers spread", () => {
    const { rect, onLive, x, width } = mount([0, 1000]);
    const middle = x + width * 0.5;
    fireEvent.pointerDown(rect, pointer("touch", 1, middle - 50));
    fireEvent.pointerDown(rect, pointer("touch", 2, middle + 50));
    fireEvent.pointerMove(rect, pointer("touch", 1, middle - 100));
    fireEvent.pointerMove(rect, pointer("touch", 2, middle + 100));
    const live = onLive.mock.calls.at(-1)?.[0];
    expect(live[1] - live[0]).toBeCloseTo(500, 5);
  });
});
