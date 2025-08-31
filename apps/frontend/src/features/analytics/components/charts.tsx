'use client'

import dynamic from "next/dynamic"

const BrowserVisitorsChart = dynamic(() => import("@/features/analytics/components/browser-visitors-chart"), {
    ssr: false,
    loading: () => <BrowserVisitorsChartSkeleton />,
})

const DeviceVisitorsChart = dynamic(() => import("@/features/analytics/components/device-visitors-chart"), {
    ssr: false,
    loading: () => <DeviceVisitorsChartSkeleton />,
})

const ClickOverTimeChart = dynamic(() => import("@/features/analytics/components/clicks-over-time-chart"), {
    ssr: false,
    loading: () => <ClickOverTimeChartSkeleton />,
})

const VisitorsPerHourChart = dynamic(() => import("@/features/analytics/components/visitors-per-hour-chart"), {
    ssr: false,
    loading: () => <VisitorsPerHourChartSkeleton />,
})

const GeographicChart = dynamic(() => import("@/features/analytics/components/geographic-chart"), {
    ssr: false,
    loading: () => <GeographicChartSkeleton />,
})

const TopRefererVisitorsChart = dynamic(() => import("@/features/analytics/components/top-referer-visitors-chart"), {
    ssr: false,
    loading: () => <TopRefererVisitorsChartSkeleton />,
})

import { GeographicChartSkeleton } from "@/features/analytics/components/geographic-chart"
import { TopRefererVisitorsChartSkeleton } from "@/features/analytics/components/top-referer-visitors-chart"
import { DeviceVisitorsChartSkeleton } from "@/features/analytics/components/device-visitors-chart"
import { BrowserVisitorsChartSkeleton } from "@/features/analytics/components/browser-visitors-chart"
import { ClickOverTimeChartSkeleton } from "@/features/analytics/components/clicks-over-time-chart"
import { VisitorsPerHourChartSkeleton } from "@/features/analytics/components/visitors-per-hour-chart"
import { useGetBrowserStats, useGetClicksOverTime, useGetDeviceStats, useGetGeographicStats, useGetHourlyStats, useGetRefererStats } from "@/features/analytics/hooks/analytics.hook"

// Mock URL data - replace with props when integrating
export default function AnalyticsCharts({ alias }: { alias: string }) {
    const { data: browserStats, isLoading, error: browserStatsError } = useGetBrowserStats({
        alias,
    });

    const { data: deviceStats, error: deviceStatsError } = useGetDeviceStats({
        alias,
    });


    const { data: clicksData, error: clicksOverTimeError } = useGetClicksOverTime({
        alias,
        groupBy: "day"
    });

    const { data: geographicStats, error: geographicError } = useGetGeographicStats({
        alias,
    });

    const { data: refererStats, error: refererError } = useGetRefererStats({
        alias,
        limit: 4
    });

    const { data: hourlyStats, error: hourlyError } = useGetHourlyStats({
        alias
    });


    return (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            {/* Browser Visitors Clicks */}
            {isLoading ?
                <BrowserVisitorsChartSkeleton /> :
                <BrowserVisitorsChart browserStats={browserStats} error={browserStatsError} />
            }

            {/* Device Breakdown */}
            {
                isLoading ?
                    <DeviceVisitorsChartSkeleton /> :
                    <DeviceVisitorsChart deviceStats={deviceStats} error={deviceStatsError} />
            }

            {/* Clicks Over Time */}
            {
                isLoading ?
                    <ClickOverTimeChartSkeleton /> :
                    <ClickOverTimeChart clicksData={clicksData} error={clicksOverTimeError} />
            }

            {/* Geographic Distribution */}
            {
                isLoading ?
                    <GeographicChartSkeleton /> :
                    <GeographicChart geographicStats={geographicStats} error={geographicError} />
            }

            {/* Hourly Activity */}
            {
                isLoading ?
                    <VisitorsPerHourChartSkeleton /> :
                    <div className="items-baseline">
                        <VisitorsPerHourChart hourlyStats={hourlyStats} error={hourlyError} />
                    </div>
            }

            {/* Top Referrers */}
            {
                isLoading ?
                    <TopRefererVisitorsChartSkeleton /> :
                    <TopRefererVisitorsChart refererStats={refererStats} error={refererError} />
            }

        </div>
    )
}