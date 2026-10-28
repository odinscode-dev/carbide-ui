import { Legend } from "recharts";

export function ChartLegend() {
  return (
    <Legend
      wrapperStyle={{
        color: "var(--carbide-text-2)",
        fontSize: "var(--carbide-fs-small)",
      }}
    />
  );
}
