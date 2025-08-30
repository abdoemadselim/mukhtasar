"use client"

import { Globe } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import { useMemo } from "react"

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
import { Skeleton } from "@/components/ui/skeleton"

import { useGetRefererStats } from "@/features/analytics/hooks/analytics.hook"


export const description = "A bar chart"

const chartConfig = {
  visitors: {
    label: "الزوار",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig

export default function TopRefererVisitorsChart({ alias, limit = 6 }: { alias: string, limit?: number }) {
  const { data: refererStats, isLoading, error } = useGetRefererStats({
    alias,
    limit
  });

  const chartData = useMemo(() => {
    if (!refererStats) return [];

    return refererStats.map(stat => ({
      website: stat.website,
      visitors: stat.visitors,
    }));
  }, [refererStats]);

  if (isLoading) {
    return <TopRefererVisitorsChartSkeleton />;
  }

  if (error || !refererStats || refererStats.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            أهم المصادر المرجعية
          </CardTitle>
          <CardDescription>
            المواقع التي تجلب أكثر الزيارات لرابطك المختصر
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[300px]">
          <div className="text-center text-muted-foreground">
            لا توجد بيانات مرجعية متاحة
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          أهم المصادر المرجعية
        </CardTitle>
        <CardDescription>
          المواقع التي تجلب أكثر الزيارات لرابطك المختصر
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="website"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              className="text-sm"
              tickFormatter={(value) => {
                // Truncate long website names
                return value.length > 10 ? `${value.slice(0, 10)}...` : value;
              }}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
              labelFormatter={(label) => `الموقع: ${label}`}
            />
            <Bar
              dataKey="visitors"
              fill="var(--color-visitors)"
              radius={[4, 4, 0, 0]}
              maxBarSize={60}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}


export function TopRefererVisitorsChartSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          أهم المصادر المرجعية
        </CardTitle>
        <CardDescription>
          المواقع التي تجلب أكثر الزيارات لرابطك المختصر
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full h-[300px] flex flex-col">
          {/* Chart area */}
          <div className="flex-1 flex items-end justify-between px-4 pb-4">
            {/* Vertical bar chart skeleton */}
            {[
              { height: '85%' },
              { height: '70%' },
              { height: '60%' },
              { height: '45%' },
              { height: '30%' }
            ].map((bar, index) => (
              <div
                key={index}
                className="flex flex-col items-center justify-end flex-1 mx-2"
              >
                <Skeleton
                  className="rounded-lg"
                  style={{
                    height: bar.height,
                    width: '100px',
                    maxWidth: '100%'
                  }}
                />
              </div>
            ))}
          </div>

          {/* X-axis labels skeleton (website names) */}
          <div className="flex justify-between px-4 pt-2">
            {[
              { width: 'w-16' }, // Google
              { width: 'w-12' }, // Direct  
              { width: 'w-20' }, // Facebook
              { width: 'w-14' }, // Twitter
              { width: 'w-18' }  // LinkedIn
            ].map((label, index) => (
              <div key={index} className="flex-1 flex justify-center mx-2">
                <Skeleton className={`h-4 ${label.width}`} />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}