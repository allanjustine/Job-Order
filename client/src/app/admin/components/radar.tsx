"use client";

import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

export const description = "A radar chart with dots";

const chartConfig = (title: string) => {
  return {
    [title]: {
      label: title,
      color: "var(--chart-1)",
    },
  } satisfies ChartConfig;
};

export type ChartDataType = {
  month: string;
  total?: number;
};

export function RadarComponent({
  chartData,
  title,
}: {
  chartData: ChartDataType[];
  title: string;
}) {
  return (
    <Card>
      <CardHeader className="items-center">
        <CardTitle className="capitalize">
          {title.replaceAll("_", " ")} per last 6 months
        </CardTitle>
        <CardDescription>
          Showing total {title.replaceAll("_", " ")} for the last 6 months
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-0">
        <ChartContainer
          config={chartConfig(title)}
          className="mx-auto max-h-62.5"
        >
          <RadarChart data={chartData}>
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <PolarAngleAxis dataKey="month" />
            <PolarGrid />
            <Radar
              dataKey={"total"}
              fill={`var(--color-${title})`}
              fillOpacity={0.6}
              dot={{
                r: 4,
                fillOpacity: 1,
              }}
            />
          </RadarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
