'use client'
import { Calendar, Clock, MousePointer, Users } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useGetAnalyticsOverview } from "@/features/analytics/hooks/analytics.hook";

export default function StatsCards({ alias }: { alias: string }) {
    const { data: overview, isLoading, error } = useGetAnalyticsOverview({
        alias,
    });

    if (isLoading) {
        return <StatsCardsSkeleton />
    }

    if (error || !overview) {
        return (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardContent className="p-6">
                        <div className="text-sm text-muted-foreground">خطأ في تحميل البيانات</div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">إجمالي النقرات</CardTitle>
                    <MousePointer className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{overview.total_clicks?.toLocaleString() || 0}</div>
                    <p className="text-xs text-muted-foreground">
                        متوسط {overview.avg_clicks_per_day?.toFixed(1) || 0} نقرة يومياً
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">الزوار الجداد</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{overview.unique_visitors?.toLocaleString() || 0}</div>
                    <p className="text-xs text-muted-foreground">
                        زائر فريد خلال الفترة المحددة
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">الأيام النشطة</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{overview.active_days || 0}</div>
                    <p className="text-xs text-muted-foreground">
                        أيام بها نقرات
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">متوسط النقرات</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{overview.avg_clicks_per_day?.toFixed(1) || 0}</div>
                    <p className="text-xs text-muted-foreground">
                        نقرة في اليوم الواحد
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}

export function StatsCardsSkeleton() {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                <div className="flex flex-row items-center justify-between space-y-0 p-6">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-4" />
                </div>
                <div className="p-6 pt-0">
                    <Skeleton className="h-8 w-32" />
                    <Skeleton className="h-3 w-28 mt-2" />
                </div>
            </div>

            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                <div className="flex flex-row items-center justify-between space-y-0 p-6">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-4" />
                </div>
                <div className="p-6 pt-0">
                    <Skeleton className="h-8 w-32" />
                    <Skeleton className="h-3 w-28 mt-2" />
                </div>
            </div>

            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                <div className="flex flex-row items-center justify-between space-y-0 p-6">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-4" />
                </div>
                <div className="p-6 pt-0">
                    <Skeleton className="h-8 w-32" />
                    <Skeleton className="h-3 w-28 mt-2" />
                </div>
            </div>

            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                <div className="flex flex-row items-center justify-between space-y-0 p-6">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-4" />
                </div>
                <div className="p-6 pt-0">
                    <Skeleton className="h-8 w-32" />
                    <Skeleton className="h-3 w-28 mt-2" />
                </div>
            </div>
        </div>
    )
}