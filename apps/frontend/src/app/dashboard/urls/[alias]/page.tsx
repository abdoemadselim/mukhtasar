import { Suspense } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Highlighter } from "@/components/ui/highlighter"

import BrowserVisitorsChart, { BrowserVisitorsChartSkeleton } from "@/features/analytics/components/browser-visitors-chart"
import DeviceVisitorsChart, { DeviceVisitorsChartSkeleton } from "@/features/analytics/components/device-visitors-chart"
import ClickOverTimeChart, { ClickOverTimeChartSkeleton } from "@/features/analytics/components/clicks-over-time-chart"
import VisitorsPerHourChart, { VisitorsPerHourChartSkeleton } from "@/features/analytics/components/visitors-per-hour-chart"
import GeographicChart, { GeographicChartSkeleton } from "@/features/analytics/components/geographic-chart"
import TopRefererVisitorsChart, { TopRefererVisitorsChartSkeleton } from "@/features/analytics/components/top-referer-visitors-chart"
import StatsCards, { StatsCardsSkeleton } from "@/features/analytics/components/stats-cards"
import { ErrorBoundary } from "next/dist/client/components/error-boundary"

// Mock URL data - replace with props when integrating
export default async function UrlAnalyticsPage(
    {
        params
    }: {
        params: Promise<{ alias: string }>
    }) {
    const { alias } = await params
    return (
        <div className="flex flex-1 flex-col gap-6 p-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/dashboard/urls">
                    <Button
                        variant="outline"
                        size="sm"
                        className="cursor-pointer"
                    >
                        <ArrowLeft
                            className="h-4 w-4" />
                        العودة
                    </Button>
                </Link>
                <div className="flex-1">
                    <h1 className="text-3xl font-bold">
                        <Highlighter action="underline" color="#4F39DD">
                            تحليلات الرابط
                        </Highlighter>
                    </h1>
                    <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline">{alias}</Badge>
                        <span className="text-muted-foreground">•</span>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <StatsCards alias={alias} />

            {/* Charts Grid */}
            <div className="grid gap-6 xl:grid-cols-2">
                {/* Browser Visitors Clicks */}
                <Suspense fallback={<BrowserVisitorsChartSkeleton />}>
                    <ErrorBoundary fallback={<div>⚠️ لا توجد بيانات متاحة</div>}>
                        <BrowserVisitorsChart alias={alias} />
                    </ErrorBoundary>
                </Suspense>
                {/* Device Breakdown */}
                <Suspense fallback={<DeviceVisitorsChartSkeleton />}>
                    <ErrorBoundary fallback={<div>⚠️ لا توجد بيانات متاحة</div>}>
                        <DeviceVisitorsChart alias={alias} />
                    </ErrorBoundary>
                </Suspense>

                {/* Clicks Over Time */}
                <Suspense fallback={<ClickOverTimeChartSkeleton />}>
                    <ErrorBoundary fallback={<div>⚠️ لا توجد بيانات متاحة</div>}>
                        <ClickOverTimeChart alias={alias} />
                    </ErrorBoundary>
                </Suspense>

                {/* Geographic Distribution */}
                <Suspense fallback={<GeographicChartSkeleton />}>
                    <ErrorBoundary fallback={<div>⚠️ لا توجد بيانات متاحة</div>}>
                        <GeographicChart alias={alias} />
                    </ErrorBoundary>
                </Suspense>

                {/* Hourly Activity */}
                <div className="items-baseline">
                    <Suspense fallback={<VisitorsPerHourChartSkeleton />}>
                        <ErrorBoundary fallback={<div>⚠️ لا توجد بيانات متاحة</div>}>
                            <VisitorsPerHourChart alias={alias} />
                        </ErrorBoundary>
                    </Suspense>
                </div>

                {/* Top Referrers */}
                <Suspense fallback={<TopRefererVisitorsChartSkeleton />}>
                    <ErrorBoundary fallback={<div>⚠️ لا توجد بيانات متاحة</div>}>
                        <TopRefererVisitorsChart alias={alias} />
                    </ErrorBoundary>
                </Suspense>
            </div>
        </div>
    )
}