import { Button } from "../Button/index.js";
import { t } from "../i18n/t.js";
import styles from "./ZoomControls.module.css";

/** The texts of the zoom controls; every one left out comes from the catalog. */
export interface ChartZoomTexts {
  /** Name of the group of buttons. */
  controls?: string | undefined;
  zoomIn?: string | undefined;
  zoomOut?: string | undefined;
  /** The visible text of the button that undoes the zoom. */
  reset?: string | undefined;
  panLeft?: string | undefined;
  panRight?: string | undefined;
}

export interface ZoomControlsProps {
  texts?: ChartZoomTexts | undefined;
  zoomed: boolean;
  canZoomIn: boolean;
  canPanLeft: boolean;
  canPanRight: boolean;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onPanLeft: () => void;
  onPanRight: () => void;
  onReset: () => void;
}

// The keyboard's way to zoom, next to dragging: zoom in and out around the
// middle, move sideways once zoomed, and take the zoom back. The reset button
// with its text is also what tells you that the chart shows a stretch only.
export function ZoomControls({
  texts,
  zoomed,
  canZoomIn,
  canPanLeft,
  canPanRight,
  onZoomIn,
  onZoomOut,
  onPanLeft,
  onPanRight,
  onReset,
}: ZoomControlsProps) {
  return (
    <div
      aria-label={texts?.controls ?? t("chart.zoomControls")}
      className={styles.root}
      role="toolbar"
    >
      {zoomed && (
        <Button onClick={onReset} variant="secondary">
          {texts?.reset ?? t("chart.zoomReset")}
        </Button>
      )}
      {zoomed && (
        <Button
          aria-label={texts?.panLeft ?? t("chart.panLeft")}
          disabled={!canPanLeft}
          icon={<Glyph d="M10 3L5 8l5 5" />}
          onClick={onPanLeft}
          variant="ghost"
        />
      )}
      {zoomed && (
        <Button
          aria-label={texts?.panRight ?? t("chart.panRight")}
          disabled={!canPanRight}
          icon={<Glyph d="M6 3l5 5-5 5" />}
          onClick={onPanRight}
          variant="ghost"
        />
      )}
      <Button
        aria-label={texts?.zoomOut ?? t("chart.zoomOut")}
        disabled={!zoomed}
        icon={<Glyph d="M3 8h10" />}
        onClick={onZoomOut}
        variant="ghost"
      />
      <Button
        aria-label={texts?.zoomIn ?? t("chart.zoomIn")}
        disabled={!canZoomIn}
        icon={<Glyph d="M3 8h10M8 3v10" />}
        onClick={onZoomIn}
        variant="ghost"
      />
    </div>
  );
}

function Glyph({ d }: { d: string }) {
  return (
    <svg aria-hidden="true" className={styles.glyph} fill="none" viewBox="0 0 16 16">
      <path
        d={d}
        stroke="currentcolor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}
