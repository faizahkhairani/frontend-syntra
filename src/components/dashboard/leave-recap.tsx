// src/components/dashboard/LeaveRequestChart.tsx
"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

interface LeaveRequestChartProps {
  data: {
    pending: number;
    approved: number;
    rejected: number;
  };
  isLoading?: boolean;
}

const COLORS = {
  pending: "#6675D6",
  approved: "#3F53C3",
  rejected: "#A3ACE8",
};

const LABELS: Record<string, string> = {
  pending: "Menunggu",
  approved: "Disetujui",
  rejected: "Ditolak",
};

export function LeaveRequestChart({ data, isLoading }: LeaveRequestChartProps) {
  const chartData = Object.entries(data).map(([key, value]) => ({
    key,
    name: LABELS[key],
    value,
  }));

  const total = chartData.reduce((sum, d) => sum + d.value, 0);

  return (
    <Card className="shadow-none border-border/60">
      <CardHeader className="pb-2 font-semibold text-lg">
          Pengajuan Cuti
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-70 w-full" />
        ) : total === 0 ? (
          <div className="flex h-70 items-center justify-center text-sm text-muted-foreground">
            Belum ada pengajuan cuti
          </div>
        ) : (
          <div className="relative">
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={3}
                  strokeWidth={0}
                >
                  {chartData.map((entry) => (
                    <Cell key={entry.key} fill={COLORS[entry.key as keyof typeof COLORS]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => {
                    const count = typeof value === "number" ? value : 0
                    return `${count} pengajuan`
                  }}
                  contentStyle={{
                    borderRadius: 8,
                    border: "1px solid hsl(var(--border))",
                    fontSize: 13,
                  }}
                />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* total di tengah donut */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none" style={{ top: "-20px" }}>
              <span className="text-2xl font-bold">{total}</span>
              <span className="text-xs text-muted-foreground">Total</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}