import { apiClient, ApiError } from "@/lib/api-client";

export type AnalyticsOverview = {
    total_clicks: number;
    unique_visitors: number;
    active_days: number;
    avg_clicks_per_day: number;
}

export type BrowserStat = {
    browser: string;
    visitors: number;
    percentage: number;
}

export type DeviceStat = {
    device: string;
    visitors: number;
    percentage: number;
}

export type ClickOverTime = {
    date: string;
    clicks: number;
    unique_visitors: number;
}

export type GeographicStat = {
    country: string;
    clicks: number;
}

export type RefererStat = {
    website: string;
    visitors: number;
}

export type HourlyStat = {
    hour: string;
    clicks: number;
}



export type AnalyticsParams = {
    alias: string;
    startDate?: string;
    endDate?: string;
}

export type ClicksOverTimeParams = AnalyticsParams & {
    groupBy?: 'hour' | 'day' | 'week' | 'month';
}

export type RefererStatsParams = AnalyticsParams & {
    limit?: number;
}


// Get analytics overview (summary stats)
export async function getAnalyticsOverview({ alias, startDate, endDate }: AnalyticsParams){
    const params = new URLSearchParams({
        alias,
        ...(startDate && { startDate }),
        ...(endDate && { endDate }),
    });

    return apiClient.get(`/analytics/overview?${params.toString()}`, {
        throwOnError: true,
        includeCredentials: true,
        cache: 'no-store'
    });
}

// Get browser statistics
export async function getBrowserStats({ alias, startDate, endDate }: AnalyticsParams) {
    const params = new URLSearchParams({
        alias,
        ...(startDate && { startDate }),
        ...(endDate && { endDate }),
    });

    return apiClient.get(`/analytics/browsers?${params.toString()}`, {
        throwOnError: true,
        includeCredentials: true,
        cache: 'no-store'
    });
}

// Get device statistics
export async function getDeviceStats({ alias, startDate, endDate }: AnalyticsParams) {
    const params = new URLSearchParams({
        alias,
        ...(startDate && { startDate }),
        ...(endDate && { endDate }),
    });

    return apiClient.get(`/analytics/devices?${params.toString()}`, {
        throwOnError: true,
        includeCredentials: true,
        cache: 'no-store'
    });
}

// Get clicks over time
export async function getClicksOverTime({ alias, startDate, endDate, groupBy = 'day' }: ClicksOverTimeParams) {
    const params = new URLSearchParams({
        alias,
        groupBy,
        ...(startDate && { startDate }),
        ...(endDate && { endDate }),
    });

    return apiClient.get(`/analytics/clicks-over-time?${params.toString()}`, {
        throwOnError: true,
        includeCredentials: true,
        cache: 'no-store'
    });
}

// Get geographic statistics
export async function getGeographicStats({ alias, startDate, endDate }: AnalyticsParams) {
    const params = new URLSearchParams({
        alias,
        ...(startDate && { startDate }),
        ...(endDate && { endDate }),
    });

    return apiClient.get(`/analytics/geography?${params.toString()}`, {
        throwOnError: true,
        includeCredentials: true,
        cache: 'no-store'
    });
}

// Get referer statistics
export async function getRefererStats({ alias, startDate, endDate, limit = 10 }: RefererStatsParams) {
    const params = new URLSearchParams({
        alias,
        limit: limit.toString(),
        ...(startDate && { startDate }),
        ...(endDate && { endDate }),
    });

    return apiClient.get(`/analytics/referers?${params.toString()}`, {
        throwOnError: true,
        includeCredentials: true,
        cache: 'no-store'
    });
}

// Get hourly statistics
export async function getHourlyStats({ alias, startDate, endDate }: AnalyticsParams) {
    const params = new URLSearchParams({
        alias,
        ...(startDate && { startDate }),
        ...(endDate && { endDate }),
    });

    return apiClient.get(`/analytics/hourly?${params.toString()}`, {
        throwOnError: true,
        includeCredentials: true,
        cache: 'no-store'
    });
}