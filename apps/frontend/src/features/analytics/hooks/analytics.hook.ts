// apps/frontend/src/features/analytics/hooks/analytics-query.ts
import { useQuery } from "@tanstack/react-query";
import {
    getAnalyticsOverview,
    getBrowserStats,
    getDeviceStats,
    getClicksOverTime,
    getGeographicStats,
    getRefererStats,
    getHourlyStats,
    AnalyticsParams,
    ClicksOverTimeParams,
    RefererStatsParams,
    AnalyticsOverview,
    BrowserStat,
    DeviceStat,
    ClickOverTime,
    GeographicStat,
    RefererStat,
    HourlyStat
} from "@/features/analytics/service/analytics.service";


// Hook for analytics overview
export function useGetAnalyticsOverview(params: AnalyticsParams) {
    return useQuery<AnalyticsOverview>({
        queryKey: ["analytics-overview", params.alias, params.startDate, params.endDate],
        queryFn: () => getAnalyticsOverview(params),
        staleTime: 2 * 60 * 1000,
        gcTime: 5 * 60 * 1000,
        retry: 2,
        refetchOnWindowFocus: false,
        suspense: true,
        enabled: !!params.alias,
    });
}

// Hook for browser statistics
export function useGetBrowserStats(params: AnalyticsParams) {
    return useQuery<BrowserStat[]>({
        queryKey: ["browser-stats", params.alias, params.startDate, params.endDate],
        queryFn: () => getBrowserStats(params),
        staleTime: 2 * 60 * 1000,
        gcTime: 5 * 60 * 1000,
        retry: 2,
        suspense: true,
        refetchOnWindowFocus: false,
        enabled: !!params.alias,
    });
}

// Hook for device statistics
export function useGetDeviceStats(params: AnalyticsParams) {
    return useQuery<DeviceStat[]>({
        queryKey: ["device-stats", params.alias, params.startDate, params.endDate],
        queryFn: () => getDeviceStats(params),
        staleTime: 2 * 60 * 1000,
        gcTime: 5 * 60 * 1000,
        retry: 2,
        suspense: true,
        refetchOnWindowFocus: false,
        enabled: !!params.alias,
    });
}

// Hook for clicks over time
export function useGetClicksOverTime(params: ClicksOverTimeParams) {
    return useQuery<ClickOverTime[]>({
        queryKey: ["clicks-over-time", params.alias, params.startDate, params.endDate, params.groupBy],
        queryFn: () => getClicksOverTime(params),
        staleTime: 2 * 60 * 1000,
        gcTime: 5 * 60 * 1000,
        retry: 2,
        suspense: true,
        refetchOnWindowFocus: false,
        enabled: !!params.alias,
    });
}

// Hook for geographic statistics
export function useGetGeographicStats(params: AnalyticsParams) {
    return useQuery<GeographicStat[]>({
        queryKey: ["geographic-stats", params.alias, params.startDate, params.endDate],
        queryFn: () => getGeographicStats(params),
        staleTime: 2 * 60 * 1000,
        gcTime: 5 * 60 * 1000,
        retry: 2,
        suspense: true,
        refetchOnWindowFocus: false,
        enabled: !!params.alias,
    });
}

// Hook for referer statistics
export function useGetRefererStats(params: RefererStatsParams) {
    return useQuery<RefererStat[]>({
        queryKey: ["referer-stats", params.alias, params.startDate, params.endDate, params.limit],
        queryFn: () => getRefererStats(params),
        staleTime: 2 * 60 * 1000,
        gcTime: 5 * 60 * 1000,
        retry: 2,
        suspense: true,
        refetchOnWindowFocus: false,
        enabled: !!params.alias,
    });
}

// Hook for hourly statistics
export function useGetHourlyStats(params: AnalyticsParams) {
    return useQuery<HourlyStat[]>({
        queryKey: ["hourly-stats", params.alias, params.startDate, params.endDate],
        queryFn: () => getHourlyStats(params),
        staleTime: 2 * 60 * 1000,
        gcTime: 5 * 60 * 1000,
        retry: 2,
        suspense: true,
        useErrorBondary: true,
        refetchOnWindowFocus: false,
        enabled: !!params.alias,
    });
}