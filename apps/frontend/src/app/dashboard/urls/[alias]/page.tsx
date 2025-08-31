import StatsCards from "@/features/analytics/components/stats-cards"
import AnalyticsCharts from "@/features/analytics/components/charts"

// Mock URL data - replace with props when integrating
export default async function UrlAnalyticsPage(
    {
        params
    }: {
        params: Promise<{ alias: string }>
    }) {
    const { alias } = await params
    return (
        <div>
            {/* Stats Cards */}
            <StatsCards alias={alias} />
            <AnalyticsCharts alias={alias} />
        </div>
    )
}