import { type PointerEvent, useRef, useState } from "react";
import { usePlotArea } from "recharts";
import { CHART_REF_AREA_ALPHA, CHART_REF_LINE } from "./ChartContainer.js";
import {
  type ChartDomain,
  clampDomain,
  isFullDomain,
  panBy,
  selectionDomain,
  valueAt,
  type ZoomLimits,
  zoomAround,
} from "./zoom.js";

/** A drag narrower than this (px) is a click, not a selection. */
const MIN_DRAG_PX = 8;

export interface ZoomLayerProps {
  /** The stretch the axis shows right now: the whole data span when unzoomed. */
  shown: ChartDomain;
  limits: ZoomLimits;
  /** A touch gesture in progress: the domain to show meanwhile; null when it is over or cancelled. */
  onLive: (domain: ChartDomain | null) => void;
  /** A finished gesture: the domain to keep. */
  onCommit: (domain: ChartDomain) => void;
}

type Gesture =
  | { kind: "select"; startX: number }
  | { kind: "pan"; startX: number; startDomain: ChartDomain }
  | { kind: "pinch"; startDistance: number; startDomain: ChartDomain; anchor: number };

interface Selection {
  from: number;
  to: number;
}

// Sits on top of the plot area of a chart and turns pointer gestures into a
// zoom: a mouse (or pen) drags out the stretch to show, a finger swipes the
// zoomed stretch sideways, two fingers pinch it wider or narrower. The result
// is reported, not applied -- the chart's domain is the caller's to keep.
export function ZoomLayer({ shown, limits, onLive, onCommit }: ZoomLayerProps) {
  const plot = usePlotArea();
  const pointers = useRef(new Map<number, number>());
  const gesture = useRef<Gesture | null>(null);
  const live = useRef<ChartDomain | null>(null);
  const selected = useRef<Selection | null>(null);
  const [selection, setSelection] = useState<Selection | null>(null);

  if (plot === undefined || plot.width <= 0) {
    return null;
  }

  const left = plot.x;
  const width = plot.width;
  const spanOf = (domain: ChartDomain) => domain[1] - domain[0];
  const fraction = (x: number) => (x - left) / width;
  const clampX = (x: number) => Math.min(Math.max(x, left), left + width);

  function localX(event: PointerEvent<SVGRectElement>): number {
    const svg = event.currentTarget.ownerSVGElement;
    return event.clientX - (svg?.getBoundingClientRect().left ?? 0);
  }

  function select(next: Selection | null) {
    selected.current = next;
    setSelection(next);
  }

  function setLive(domain: ChartDomain) {
    live.current = domain;
    onLive(domain);
  }

  function onPointerDown(event: PointerEvent<SVGRectElement>) {
    if (event.pointerType === "mouse" && event.button !== 0) {
      return;
    }
    event.currentTarget.setPointerCapture(event.pointerId);
    const x = localX(event);
    pointers.current.set(event.pointerId, x);
    live.current = null;
    if (event.pointerType !== "touch") {
      const startX = clampX(x);
      gesture.current = { kind: "select", startX };
      select({ from: startX, to: startX });
      return;
    }
    if (pointers.current.size === 1) {
      gesture.current = { kind: "pan", startX: x, startDomain: shown };
      return;
    }
    const [a, b] = [...pointers.current.values()];
    if (a !== undefined && b !== undefined) {
      gesture.current = {
        kind: "pinch",
        startDistance: Math.max(Math.abs(a - b), 1),
        startDomain: shown,
        anchor: valueAt(shown, fraction((a + b) / 2)),
      };
    }
  }

  function onPointerMove(event: PointerEvent<SVGRectElement>) {
    if (!pointers.current.has(event.pointerId)) {
      return;
    }
    const x = localX(event);
    pointers.current.set(event.pointerId, x);
    const current = gesture.current;
    if (current === null) {
      return;
    }
    if (current.kind === "select") {
      select({ from: current.startX, to: clampX(x) });
    } else if (current.kind === "pan") {
      const delta = (-(x - current.startX) / width) * spanOf(current.startDomain);
      setLive(panBy(current.startDomain, limits, delta));
    } else {
      const [a, b] = [...pointers.current.values()];
      if (a !== undefined && b !== undefined) {
        const factor = current.startDistance / Math.max(Math.abs(a - b), 1);
        setLive(
          zoomAround(
            current.startDomain,
            limits,
            factor,
            current.anchor,
            Math.min(Math.max(fraction((a + b) / 2), 0), 1),
          ),
        );
      }
    }
  }

  function finish(event: PointerEvent<SVGRectElement>, cancelled: boolean) {
    if (!pointers.current.delete(event.pointerId)) {
      return;
    }
    const current = gesture.current;
    gesture.current = null;
    if (current?.kind === "select") {
      const dragged = selected.current;
      select(null);
      if (!cancelled && dragged !== null && Math.abs(dragged.to - dragged.from) >= MIN_DRAG_PX) {
        const chosen = selectionDomain(
          valueAt(shown, fraction(dragged.from)),
          valueAt(shown, fraction(dragged.to)),
          limits,
        );
        if (chosen !== undefined) {
          onCommit(chosen);
        }
      }
      return;
    }
    const result = live.current;
    live.current = null;
    if (cancelled || result === null) {
      onLive(null);
    } else {
      onCommit(clampDomain(result, limits));
    }
  }

  return (
    <g>
      <rect
        fill="transparent"
        height={plot.height}
        onPointerCancel={(event) => finish(event, true)}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={(event) => finish(event, false)}
        style={{
          cursor: isFullDomain(shown, limits) ? "crosshair" : "col-resize",
          touchAction: "pan-y",
          userSelect: "none",
        }}
        width={plot.width}
        x={plot.x}
        y={plot.y}
      />
      {selection !== null && (
        <rect
          fill={CHART_REF_LINE}
          fillOpacity={CHART_REF_AREA_ALPHA}
          height={plot.height}
          pointerEvents="none"
          width={Math.abs(selection.to - selection.from)}
          x={Math.min(selection.from, selection.to)}
          y={plot.y}
        />
      )}
    </g>
  );
}
