'use client'

import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"
import { Activity } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

import { useGetHourlyStats } from "@/features/analytics/hooks/analytics.hook"

export default function VisitorsPerHourChart({ alias }: { alias: string }) {
    const { data: hourlyStats, isLoading, error } = useGetHourlyStats({
        alias
    });
    if (isLoading) {
        return <VisitorsPerHourChartSkeleton />;
    }

    if (error || !hourlyStats || hourlyStats.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-5">
                        <Activity className="h-5 w-5" />
                        النشاط بالساعات
                    </CardTitle>
                    <CardDescription>
                        توزيع النقرات خلال ساعات اليوم
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-center h-[250px]">
                    <div className="text-center text-muted-foreground">
                        لا توجد بيانات ساعية متاحة
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-5">
                    <Activity className="h-5 w-5" />
                    النشاط بالساعات
                </CardTitle>
                <CardDescription>
                    توزيع النقرات خلال ساعات اليوم
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={hourlyStats}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground) / 0.2)" />
                        <XAxis
                            dataKey="hour"
                            stroke="hsl(var(--muted-foreground))"
                            fontSize={12}
                            tickFormatter={(value) => `${value}:00`}
                        />
                        <YAxis
                            stroke="hsl(var(--muted-foreground))"
                            fontSize={12}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "hsl(var(--background))",
                                border: "1px solid hsl(var(--border))",
                                borderRadius: "8px",
                                color: "hsl(var(--foreground))"
                            }}
                            labelFormatter={(value) => `الساعة: ${value}:00`}
                            formatter={(value) => [value, 'النقرات']}
                        />
                        <Line
                            type="monotone"
                            dataKey="clicks"
                            stroke="hsl(var(--primary))"
                            strokeWidth={2}
                            dot={{
                                fill: 'hsl(var(--primary))',
                                strokeWidth: 2,
                                r: 4,
                                fillOpacity: 0.8
                            }}
                            activeDot={{
                                r: 6,
                                fill: 'hsl(var(--primary))',
                                stroke: 'hsl(var(--background))',
                                strokeWidth: 2
                            }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}

export function VisitorsPerHourChartSkeleton() {
    return (
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="p-6">
                <div className="flex items-center gap-5">
                    <Skeleton className="h-5 w-5" />
                    <Skeleton className="h-6 w-32" />
                </div>
                <Skeleton className="h-4 w-48 mt-2" />
            </div>
            <div className="p-6 pt-0">
                <Skeleton className="w-full h-[250px]" />
            </div>
        </div>
    )
}