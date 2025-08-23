"use client"

import { Label, Pie, PieChart } from "recharts"

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
import { useMemo } from "react"
import { Earth } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

export const description = "عدد الزوار / المتصفح"

const chartData = [
    { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
    { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
    { browser: "firefox", visitors: 287, fill: "var(--color-firefox)" },
    { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
    { browser: "other", visitors: 190, fill: "var(--color-other)" },
]

const chartConfig = {
    visitors: {
        label: "الزوار",
    },
    chrome: {
        label: "Chrome",
        color: "var(--chart-1)",
    },
    safari: {
        label: "Safari",
        color: "var(--chart-2)",
    },
    firefox: {
        label: "Firefox",
        color: "var(--chart-3)",
    },
    edge: {
        label: "Edge",
        color: "var(--chart-4)",
    },
    other: {
        label: "Other",
        color: "var(--chart-5)",
    },
} satisfies ChartConfig

export default function BrowserVisitorsChart() {
    const totalVisitors = useMemo(() => {
        return chartData.reduce((acc, curr) => acc + curr.visitors, 0)
    }, [])

    return (
        <Card className="flex flex-col">
            <CardHeader className="items-center pb-0">
                <CardTitle className="flex items-center gap-5">
                    <Earth className="h-5 w-5" />
                    المتصفح
                </CardTitle>
                <CardDescription>
                    توزيع النقرات حسب نوع المتصفح
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[250px]"
                >
                    <PieChart>
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Pie
                            data={chartData}
                            dataKey="visitors"
                            nameKey="browser"
                            innerRadius={60}
                            strokeWidth={5}
                        >
                            <Label
                                content={({ viewBox }) => {
                                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                        return (
                                            <text
                                                x={viewBox.cx}
                                                y={viewBox.cy}
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                            >
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={viewBox.cy}
                                                    className="fill-foreground text-3xl font-bold"
                                                >
                                                    {totalVisitors.toLocaleString()}
                                                </tspan>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) + 24}
                                                    className="fill-muted-foreground"
                                                >
                                                    الزوار
                                                </tspan>
                                            </text>
                                        )
                                    }
                                }}
                            />
                        </Pie>
                    </PieChart>
                </ChartContainer>
            </CardContent>

        </Card>
    )
}

export function BrowserVisitorsChartSkeleton() {
    return (
        <Card className="flex flex-col">
            <CardHeader className="items-center pb-0">
                <CardTitle className="flex items-center gap-5">
                    <Earth className="h-5 w-5" />
                    المتصفح
                </CardTitle>
                <CardDescription>
                    توزيع النقرات حسب نوع المتصفح
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <div className="mx-auto aspect-square max-h-[250px] flex items-center justify-center relative">
                    {/* Outer pie chart skeleton */}
                    <div className="relative w-full h-full max-w-[250px] max-h-[250px]">
                        {/* Pie segments skeleton */}
                        <div className="absolute inset-0 rounded-full border-[20px] border-muted animate-pulse" />
                        
                        {/* Individual segments with different opacities to simulate pie slices */}
                        <div className="absolute inset-0 rounded-full" style={{
                            background: `conic-gradient(
                                hsl(var(--muted)) 0deg 90deg,
                                hsl(var(--muted-foreground) / 0.1) 90deg 150deg,
                                hsl(var(--muted)) 150deg 210deg,
                                hsl(var(--muted-foreground) / 0.1) 210deg 270deg,
                                hsl(var(--muted)) 270deg 360deg
                            )`,
                            mask: 'radial-gradient(circle at center, transparent 60px, black 60px, black 125px, transparent 125px)'
                        }} />
                        
                        {/* Center content skeleton */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <Skeleton    className="h-8 w-16 mb-2" />
                            <Skeleton className="h-4 w-12" />
                        </div>
                    </div>
                </div>
                
                {/* Legend skeleton */}
                <div className="mt-4 space-y-2">
                    {[1, 2, 3, 4, 5].map((item) => (
                        <div key={item} className="flex items-center gap-2 px-2">
                            <Skeleton className="h-3 w-3 rounded-full" />
                            <Skeleton className="h-4 w-16" />
                            <div className="ml-auto">
                                <Skeleton className="h-4 w-8" />
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}