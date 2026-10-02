"use client";

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";

const chartConfig = {
  job_request_sales: {
    label: "Job Request Sales",
    color: "var(--chart-1)",
  },
  parts_replacement_sales: {
    label: "Parts Replacement Sales",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export function AreaChartComponent({
  chartData,
  isLoading,
}: {
  chartData: {
    month: string;
    job_request_sales: number;
    parts_replacement_sales: number;
  }[];
  isLoading: boolean;
}) {
  return (
    <Card className="pt-0 mt-5">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>Total Sales per Month</CardTitle>
          <CardDescription>
            Showing total sales per month for the current year
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {isLoading ? (
          <Skeleton className="w-full h-62.5" />
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-62.5 w-full"
          >
            <AreaChart data={chartData}>
              <defs>
                <linearGradient
                  id="fillJobRequestSales"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="var(--color-job_request_sales)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-job_request_sales)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient
                  id="fillPartsReplacementSales"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="var(--color-parts_replacement_sales)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-parts_replacement_sales)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent isFormattedValue indicator="dot" />
                }
              />
              <Area
                dataKey="parts_replacement_sales"
                type="natural"
                fill="url(#fillPartsReplacementSales)"
                stroke="var(--color-parts_replacement_sales)"
                stackId="a"
              />
              <Area
                dataKey="job_request_sales"
                type="natural"
                fill="url(#fillJobRequestSales)"
                stroke="var(--color-job_request_sales)"
                stackId="a"
              />
              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
