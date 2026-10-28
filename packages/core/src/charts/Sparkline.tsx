import { Line, LineChart, ResponsiveContainer, YAxis } from "recharts";

export interface SparklineProps<TRow> {
  data: TRow[];
  accessorKey?: (keyof TRow & string) | undefined;
  accessorFn?: ((row: TRow) => number | null) | undefined;

  stroke: string;

  domainPadding: number;

  height?: number | `${number}%` | undefined;
}

function domainFrom(values: number[], domainPadding: number): [number, number] {
  if (values.length === 0) {
    return [0, 1];
  }
  return [Math.min(...values) - domainPadding, Math.max(...values) + domainPadding];
}

export function Sparkline<TRow>({
  data,
  accessorKey,
  accessorFn,
  stroke,
  domainPadding,
  height = 300,
}: SparklineProps<TRow>) {
  const dataKey =
    accessorFn ??
    ((row: TRow) => {
      if (accessorKey === undefined) {
        return null;
      }
      const value: unknown = row[accessorKey];
      return typeof value === "number" ? value : null;
    });

  const values = data.map(dataKey).filter((value): value is number => value !== null);
  const domain = domainFrom(values, domainPadding);

  return (
    <div aria-hidden="true" style={{ height: "100%", width: "100%" }}>
      <ResponsiveContainer height={height} width="100%">
        <LineChart data={data} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
          <YAxis domain={domain} hide type="number" />
          <Line
            activeDot={false}
            dataKey={dataKey}
            dot={false}
            isAnimationActive={false}
            stroke={stroke}
            strokeWidth={2}
            type="monotone"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
