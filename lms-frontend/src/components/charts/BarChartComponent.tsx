import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

interface ChartData {
  name: string;
  value: number;
}

interface BarChartComponentProps {
  data: ChartData[];
  color?: string;
  height?: number;
  loading?: boolean;
  xAxisLabel?: string;
  yAxisLabel?: string;
}

export function BarChartComponent({
  data,
  color = "#8884d8",
  height = 300,
  loading = false,
  xAxisLabel,
  yAxisLabel,
}: BarChartComponentProps) {
  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-muted-foreground">Loading chart data...</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <XAxis
          dataKey="name"
          label={
            xAxisLabel ? { value: xAxisLabel, position: "bottom" } : undefined
          }
        />
        <YAxis
          label={
            yAxisLabel
              ? {
                  value: yAxisLabel,
                  angle: -90,
                  position: "insideLeft",
                }
              : undefined
          }
          allowDecimals={false}
        />
        <Tooltip />
        {/* <Legend /> */}
        <Bar dataKey="value" fill={color} />
      </BarChart>
    </ResponsiveContainer>
  );
}
