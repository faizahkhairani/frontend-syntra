

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface AttendanceDatum {
  day: string; // "Sen", "Sel", ...
  hadir: number;
  terlambat: number;
  absen: number;
}

interface AttendanceChartProps {
  data: AttendanceDatum[];
  isLoading?: boolean;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border bg-background p-3 shadow-md text-sm">
      <p className="font-medium mb-1">{label}</p>
      {payload.map((item: any) => (
        <div key={item.dataKey} className="flex items-center gap-2">
          <span
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: item.color }}
          />
          <span className="text-muted-foreground capitalize">{item.dataKey}:</span>
          <span className="font-medium">{item.value}</span>
        </div>
      ))}
    </div>
  );
};

export function AttendanceChart({ data, isLoading }: AttendanceChartProps) {
  return (
    <Card className="shadow-none border-border/60">
      <CardHeader className="pb-2 text-lg font-semibold">
        Kehadiran Minggu Ini
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-70 w-full" />
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data} barCategoryGap={24}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted" />
              <XAxis
                dataKey="day"
                tickLine={false}
                axisLine={false}
                className="text-xs fill-muted-foreground"
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
                className="text-xs fill-muted-foreground"
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "hsl(var(--muted))", opacity: 0.3 }} />
              <Legend
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
              />
              <Bar dataKey="hadir" stackId="a" fill="#3F53C3" radius={[0, 0, 0, 0]} name="Hadir" />
              <Bar dataKey="terlambat" stackId="a" fill="#6675D6" name="Terlambat" />
              <Bar dataKey="absen" stackId="a" fill="#A3ACE8" radius={[4, 4, 0, 0]} name="Absen" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}