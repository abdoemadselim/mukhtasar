"use client"

import { Smartphone } from "lucide-react"
import { LabelList, Pie, PieChart } from "recharts"

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

export const description = "A pie chart with a label list"

const chartData = [
    { device: "mobile", visitors: 45, fill: "var(--color-1)" },
    { device: "desktop", visitors: 30, fill: "var(--chart-3)" },
    { device: "tablet", visitors: 20, fill: "var(--chart-4)" }
]

const chartConfig = {
    visitors: {
        label: "الزوار",
    },
    mobile: {
        label: "هاتف محمول",
        color: "var(--chart-1)",
    },
    desktop: {
        label: "سطح المكتب",
        color: "var(--chart-2)",
    },
    tablet: {
        label: "اللوحي",
        color: "var(--chart-2)",
    },
} satisfies ChartConfig

export default function DeviceVisitorsChart() {
    return (
        <Card className="flex flex-col">
            <CardHeader className="items-center pb-0">
                <CardTitle className="flex items-center gap-2">
                    <Smartphone className="h-5 w-5" />
                    الأجهزة
                </CardTitle>
                <CardDescription>
                    توزيع النقرات حسب نوع الجهاز
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="[&_.recharts-text]:fill-background mx-auto aspect-square max-h-[250px]"
                >
                    <PieChart>
                        <ChartTooltip
                            content={<ChartTooltipContent nameKey="visitors" hideLabel />}
                        />
                        <Pie data={chartData} dataKey="visitors">
                            <LabelList
                                dataKey="device"
                                className="fill-background"
                                stroke="none"
                                fontSize={12}
                                formatter={(value: keyof typeof chartConfig) =>
                                    chartConfig[value]?.label
                                }
                            />
                        </Pie>
                    </PieChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}



export function DeviceVisitorsChartSkeleton() {
    return (
        <Card className="flex flex-col">
            <CardHeader className="items-center pb-0">
                <CardTitle className="flex items-center gap-2">
                    <Smartphone className="h-5 w-5" />
                    الأجهزة
                </CardTitle>
                <CardDescription>
                    توزيع النقرات حسب نوع الجهاز
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <div className="mx-auto aspect-square max-h-[250px] flex items-center justify-center relative">
                    {/* Full pie chart skeleton */}
                    <div className="relative w-full h-full max-w-[250px] max-h-[250px]">
                        {/* Pie segments skeleton with 3 sections */}
                        <div className="absolute inset-0 rounded-full animate-pulse" style={{
                            background: `conic-gradient(
                                hsl(var(--muted)) 0deg 162deg,
                                hsl(var(--muted-foreground) / 0.15) 162deg 270deg,
                                hsl(var(--muted-foreground) / 0.05) 270deg 360deg
                            )`
                        }} />

                        {/* Label placeholders positioned within segments */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            {/* Mobile label (largest segment) */}
                            <div className="absolute" style={{
                                top: '35%',
                                left: '60%',
                                transform: 'translate(-50%, -50%)'
                            }}>
                                <Skeleton className="h-3 w-12 rounded-sm" />
                            </div>

                            {/* Desktop label */}
                            <div className="absolute" style={{
                                top: '65%',
                                left: '25%',
                                transform: 'translate(-50%, -50%)'
                            }}>
                                <Skeleton className="h-3 w-16 rounded-sm" />
                            </div>

                            {/* Tablet label */}
                            <div className="absolute" style={{
                                top: '25%',
                                left: '25%',
                                transform: 'translate(-50%, -50%)'
                            }}>
                                <Skeleton className="h-3 w-10 rounded-sm" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Legend skeleton */}
                <div className="mt-4 space-y-2">
                    {[
                        { width: 'w-20' }, // Mobile
                        { width: 'w-24' }, // Desktop 
                        { width: 'w-16' }  // Tablet
                    ].map((item, index) => (
                        <div key={index} className="flex items-center gap-2 px-2">
                            <Skeleton className="h-3 w-3 rounded-full" />
                            <Skeleton className={`h-4 ${item.width}`} />
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