import type { ReactElement } from "react";
import { ResponsiveContainer } from "recharts";

export const CHART_GRID_STROKE = "var(--carbide-chart-grid)";
export const CHART_AXIS_STROKE = "var(--carbide-chart-axis)";
export const CHART_AXIS_TEXT_FILL = "var(--carbide-chart-axis-text)";
export const CHART_TOOLTIP_BG = "var(--carbide-chart-tooltip-bg)";
export const CHART_TOOLTIP_TEXT = "var(--carbide-chart-tooltip-text)";
export const CHART_AREA_ALPHA = "var(--carbide-chart-area-alpha)";
export const CHART_REF_LINE = "var(--carbide-chart-ref-line)";
export const CHART_REF_AREA_ALPHA = "var(--carbide-chart-ref-area-alpha)";

export interface ChartContainerProps {
  height?: number | `${number}%` | undefined;
  children: ReactElement;
}

export function ChartContainer({ height = 300, children }: ChartContainerProps) {
  return (
    <ResponsiveContainer height={height} width="100%">
      {children}
    </ResponsiveContainer>
  );
}
