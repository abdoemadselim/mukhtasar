"use client"

import { useMemo, useState } from 'react';
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import { UserRound } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Skeleton } from '@/components/ui/skeleton';
import { useGetClicksOverTime } from '@/features/analytics/hooks/analytics.hook';

export const description = "An interactive bar chart"

const chartConfig = {
  views: {
    label: "عدد الزيارات",
  },
  clicks: {
    label: "النقرات",
    color: "var(--chart-1)",
  },
  unique_visitors: {
    label: "الزوار الجداد",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

export default function ClickOverTimeChart({ alias, groupBy = "day" }: { alias: string, groupBy?: "hour" | "day" | "week" | "month" }) {
  const [activeChart, setActiveChart] = useState<keyof typeof chartConfig>("clicks")

  const { data: clicksData, isLoading, error } = useGetClicksOverTime({
    alias,
    groupBy
  });

  const total = useMemo(() => {
    if (!clicksData) return { clicks: 0, unique_visitors: 0 };

    return {
      clicks: clicksData.reduce((acc, curr) => acc + curr.clicks, 0),
      unique_visitors: clicksData.reduce((acc, curr) => acc + curr.unique_visitors, 0),
    };
  }, [clicksData]);

  if (error || !clicksData || clicksData.length === 0) {
    return (
      <Card className="py-0">
        <CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row">
          <div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3 sm:!py-6">
            <CardTitle className='flex items-center gap-5'>
              <UserRound className='h-5 w-5' />
              عدد الزوار
            </CardTitle>
            <CardDescription>
              عدد الزوار خلال الفترة المحددة
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="px-2 sm:p-6 flex items-center justify-center h-[250px]">
          <div className="text-center text-muted-foreground">
            لا توجد بيانات متاحة
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="py-0">
      <CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3 sm:!py-0">
          <CardTitle className='flex items-center gap-5'>
            <UserRound className='h-5 w-5' />
            عدد الزوار
          </CardTitle>
          <CardDescription>
            عدد الزوار خلال الفترة المحددة
          </CardDescription>
        </div>
        <div className="flex">
          {(["clicks", "unique_visitors"] as const).map((key) => {
            const chart = key as keyof typeof chartConfig
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="data-[active=true]:bg-muted/50 relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l sm:border-t-0 sm:border-l sm:px-8 sm:py-6"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-muted-foreground text-xs">
                  {chartConfig[chart].label}
                </span>
                <span className="text-lg leading-none font-bold sm:text-3xl">
                  {total[key as keyof typeof total].toLocaleString()}
                </span>
              </button>
            )
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={clicksData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                if (groupBy === 'hour') {
                  return value; // Already formatted as HH:MM
                }
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="views"
                  labelFormatter={(value) => {
                    if (groupBy === 'hour') {
                      return `الساعة: ${value}`;
                    }
                    return new Date(value).toLocaleDateString("ar-EG", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  }}
                />
              }
            />
            <Bar
              dataKey={activeChart}
              fill={`var(--color-${activeChart})`}
              radius={[2, 2, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export function ClickOverTimeChartSkeleton() {
  return (
    <Card className="py-0">
      <CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3 sm:!py-0">
          <CardTitle className='flex items-center gap-5'>
            <UserRound className='h-5 w-5' />
            عدد الزوار
          </CardTitle>
          <CardDescription>
            عدد الزوار خلال الثلاث شهور الماضية
          </CardDescription>
        </div>
        <div className="flex">
          {/* Desktop button skeleton */}
          <div className="bg-muted/50 relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l sm:border-t-0 sm:border-l sm:px-8 sm:py-6">
            <Skeleton className="h-3 w-16 mb-1" />
            <Skeleton className="h-6 w-12 sm:h-8 sm:w-16" />
          </div>
          {/* Mobile button skeleton */}
          <div className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l sm:border-t-0 sm:border-l sm:px-8 sm:py-6">
            <Skeleton className="h-3 w-12 mb-1" />
            <Skeleton className="h-6 w-10 sm:h-8 sm:w-14" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <div className="aspect-auto h-[250px] w-full">
          {/* Chart skeleton */}
          <div className="h-full flex flex-col">
            {/* Chart area */}
            <div className="flex-1 flex items-end justify-between px-3 pb-8">
              {/* Bar chart skeleton with varying heights */}
              {[
                { height: '60%' },
                { height: '45%' },
                { height: '80%' },
                { height: '35%' },
                { height: '70%' },
                { height: '55%' },
                { height: '90%' },
                { height: '40%' },
                { height: '65%' },
                { height: '75%' },
                { height: '50%' },
                { height: '85%' }
              ].map((bar, index) => (
                <div
                  key={index}
                  className="flex-1 flex flex-col items-center justify-end mx-0.5"
                >
                  <Skeleton
                    className="w-full rounded-t-sm"
                    style={{ height: bar.height }}
                  />
                </div>
              ))}
            </div>

            {/* X-axis labels skeleton */}
            <div className="flex justify-between px-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <Skeleton key={index} className="h-3 w-8" />
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}