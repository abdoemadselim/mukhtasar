import { BrowserVisitorsChartSkeleton } from "@/features/analytics/components/browser-visitors-chart";
import { ClickOverTimeChartSkeleton } from "@/features/analytics/components/clicks-over-time-chart";
import { DeviceVisitorsChartSkeleton } from "@/features/analytics/components/device-visitors-chart";
import { GeographicChartSkeleton } from "@/features/analytics/components/geographic-chart";
import { StatsCardsSkeleton } from "@/features/analytics/components/stats-cards";
import { TopRefererVisitorsChartSkeleton } from "@/features/analytics/components/top-referer-visitors-chart";
import { VisitorsPerHourChartSkeleton } from "@/features/analytics/components/visitors-per-hour-chart";

export default function AnalyticsLoading() {
    return (
        <div className="flex flex-1 flex-col gap-6 p-6">
            {/* Stats Cards */}
            <StatsCardsSkeleton />

            {/* Charts Grid */}
            <div className="grid gap-6 xl:grid-cols-2">
                {/* Browser Visitors Clicks */}
                <BrowserVisitorsChartSkeleton />

                {/* Device Breakdown */}
                <DeviceVisitorsChartSkeleton />

                {/* Clicks Over Time */}
                <ClickOverTimeChartSkeleton />

                {/* Geographic Distribution */}
                <GeographicChartSkeleton />

                {/* Hourly Activity */}
                <div className="items-baseline">
                    <VisitorsPerHourChartSkeleton />
                </div>

                {/* Top Referrers */}
                <TopRefererVisitorsChartSkeleton />
            </div>
        </div>
    )
}