'use client'

import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

const hourlyData = [
    { hour: "00", clicks: 12 },
    { hour: "01", clicks: 8 },
    { hour: "02", clicks: 5 },
    { hour: "03", clicks: 3 },
    { hour: "04", clicks: 4 },
    { hour: "05", clicks: 7 },
    { hour: "06", clicks: 15 },
    { hour: "07", clicks: 25 },
    { hour: "08", clicks: 45 },
    { hour: "09", clicks: 67 },
    { hour: "10", clicks: 54 },
    { hour: "11", clicks: 43 },
    { hour: "12", clicks: 78 },
    { hour: "13", clicks: 65 },
    { hour: "14", clicks: 54 },
    { hour: "15", clicks: 67 },
    { hour: "16", clicks: 45 },
    { hour: "17", clicks: 34 },
    { hour: "18", clicks: 56 },
    { hour: "19", clicks: 43 },
    { hour: "20", clicks: 32 },
    { hour: "21", clicks: 28 },
    { hour: "22", clicks: 21 },
    { hour: "23", clicks: 16 }
]

export default function VisitorsPerHourChart() {
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
                    <LineChart data={hourlyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="hour" />
                        <YAxis />
                        <Tooltip
                            labelFormatter={(value) => `الساعة: ${value}:00`}
                            formatter={(value) => [value, 'النقرات']}
                        />
                        <Line
                            type="monotone"
                            dataKey="clicks"
                            stroke="#0088FE"
                            strokeWidth={2}
                            dot={{ fill: '#0088FE', strokeWidth: 2, r: 4 }}
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