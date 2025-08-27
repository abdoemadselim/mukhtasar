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

// Mock URL data - replace with props when integrating
const url = {
    "id": 1,
    "alias": "grok1",
    "domain": "x.ai",
    "original_url": "https://x.com/grok",
    "created_at": "2024-01-01",
    "description": "Grok profile",
    "clicks": "100",
    "short_url": "https://x.ai/grok1"
}

export default function UrlAnalyticsPage(
    {
        params
    }: {
        params: Promise<{ url: number }>
    }) {
    return (
        <div className="flex flex-1 flex-col gap-6 p-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/urls">
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
                        <Badge variant="outline">{url.alias}</Badge>
                        <span className="text-muted-foreground">•</span>
                        <span className="text-primary underline cursor-pointer">{url.short_url}</span>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <Suspense fallback={<StatsCardsSkeleton />}>
                <StatsCards />
            </Suspense>

            {/* Charts Grid */}
            <div className="grid gap-6 xl:grid-cols-2">
                {/* Browser Visitors Clicks */}
                <Suspense fallback={<BrowserVisitorsChartSkeleton />}>
                    <BrowserVisitorsChart />
                </Suspense>

                {/* Device Breakdown */}
                <Suspense fallback={<DeviceVisitorsChartSkeleton />}>
                    <DeviceVisitorsChart />
                </Suspense>

                {/* Clicks Over Time */}
                <Suspense fallback={<ClickOverTimeChartSkeleton />}>
                    <ClickOverTimeChart />
                </Suspense>

                {/* Geographic Distribution */}
                <Suspense fallback={<GeographicChartSkeleton />}>
                    <GeographicChart />
                </Suspense>

                {/* Hourly Activity */}
                <div className="items-baseline">
                    <Suspense fallback={<VisitorsPerHourChartSkeleton />}>
                        <VisitorsPerHourChart />
                    </Suspense>
                </div>

                {/* Top Referrers */}
                <Suspense fallback={<TopRefererVisitorsChartSkeleton />}>
                    <TopRefererVisitorsChart />
                </Suspense>
            </div>
        </div>
    )
}