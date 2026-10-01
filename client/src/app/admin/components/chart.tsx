"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

const chartConfig = {
  ticket: {
    label: "Ticket",
    color: "#2563eb",
  },
  job_order: {
    label: "Job Order",
    color: "#60a5fa",
  },
} satisfies ChartConfig;

export type ChartDataType = {
  month: string;
  month_number?: number;
  ticket: number;
  job_order: number;
  total?: number;
};

export function ChartData({ chartData }: { chartData: ChartDataType[] }) {
  return (
    <ChartContainer config={chartConfig} className="min-h-50 w-full">
      <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="ticket" fill="var(--color-ticket)" radius={4} />
        <Bar dataKey="job_order" fill="var(--color-job_order)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
}
