// apps/backend/src/features/analytics/domain/analytics.service.ts
import analyticsRepository from "#features/analytics/data-access/analytics.repository.js";
import urlRepository from "#root/features/url/data-access/url.repository.js";
import { AnalyticsEventInput } from "#features/analytics/types.js";
import { URLNotFoundException } from "#features/url/domain/error-types.js";

interface AnalyticsParams {
    alias: string;
    startDate: string;
    endDate: string;
}

interface AnalyticsParamsWithTimezone extends AnalyticsParams {
    timezone: string;
}

interface ClicksOverTimeParams extends AnalyticsParams {
    groupBy: string;
}

interface RefererStatsParams extends AnalyticsParams {
    limit: number;
}

export async function updateAnalytics({ analyticsEvent, url_alias }: { analyticsEvent: Omit<AnalyticsEventInput, "url_id">, url_alias: string }) {
    const url = await urlRepository.getUrlByAlias(url_alias)

    // @ts-ignore
    analyticsEvent.url_id = url.id;

    analyticsRepository.createEvent(analyticsEvent as AnalyticsEventInput);
}

export async function getUrlAnalytics({ alias, startDate, endDate, timezone }: AnalyticsParamsWithTimezone) {
    // Check if URL exists first
    const url = await urlRepository.getUrlByAlias(alias);
    if (!url) {
        throw new URLNotFoundException();
    }

    const [
        overview,
        browserStats,
        deviceStats,
        clicksOverTime,
        geographicStats,
        refererStats,
        hourlyStats
    ] = await Promise.all([
        analyticsRepository.getAnalyticsOverview({ alias, startDate, endDate }),
        analyticsRepository.getBrowserStats({ alias, startDate, endDate }),
        analyticsRepository.getDeviceStats({ alias, startDate, endDate }),
        analyticsRepository.getClicksOverTime({ alias, startDate, endDate, groupBy: 'day' }),
        analyticsRepository.getGeographicStats({ alias, startDate, endDate }),
        analyticsRepository.getRefererStats({ alias, startDate, endDate, limit: 10 }),
        analyticsRepository.getHourlyStats({ alias, startDate, endDate, timezone })
    ]);

    return {
        overview,
        browserStats,
        deviceStats,
        clicksOverTime,
        geographicStats,
        refererStats,
        hourlyStats,
        url: {
            alias: url.alias,
            domain: url.domain,
            original_url: url.original_url,
            short_url: url.short_url,
            click_count: url.click_count
        }
    };
}

export async function getBrowserStats({ alias, startDate, endDate }: AnalyticsParams) {
    // Check if URL exists first
    const url = await urlRepository.getUrlByAlias(alias);
    if (!url) {
        throw new URLNotFoundException();
    }

    return await analyticsRepository.getBrowserStats({ alias, startDate, endDate });
}

export async function getDeviceStats({ alias, startDate, endDate }: AnalyticsParams) {
    // Check if URL exists first
    const url = await urlRepository.getUrlByAlias(alias);
    if (!url) {
        throw new URLNotFoundException();
    }

    return await analyticsRepository.getDeviceStats({ alias, startDate, endDate });
}

export async function getClicksOverTime({ alias, startDate, endDate, groupBy }: ClicksOverTimeParams) {
    // Check if URL exists first
    const url = await urlRepository.getUrlByAlias(alias);
    if (!url) {
        throw new URLNotFoundException();
    }

    return await analyticsRepository.getClicksOverTime({ alias, startDate, endDate, groupBy });
}

export async function getGeographicStats({ alias, startDate, endDate }: AnalyticsParams) {
    // Check if URL exists first
    const url = await urlRepository.getUrlByAlias(alias);
    if (!url) {
        throw new URLNotFoundException();
    }

    return await analyticsRepository.getGeographicStats({ alias, startDate, endDate });
}

export async function getRefererStats({ alias, startDate, endDate, limit }: RefererStatsParams) {
    // Check if URL exists first
    const url = await urlRepository.getUrlByAlias(alias);
    if (!url) {
        throw new URLNotFoundException();
    }

    return await analyticsRepository.getRefererStats({ alias, startDate, endDate, limit });
}

export async function getHourlyStats({ alias, startDate, endDate, timezone }: AnalyticsParamsWithTimezone) {
    // Check if URL exists first
    const url = await urlRepository.getUrlByAlias(alias);
    if (!url) {
        throw new URLNotFoundException();
    }

    return await analyticsRepository.getHourlyStats({ alias, startDate, endDate, timezone });
}

export async function getAnalyticsOverview({ alias, startDate, endDate }: AnalyticsParams) {
    // Check if URL exists first
    const url = await urlRepository.getUrlByAlias(alias);
    if (!url) {
        throw new URLNotFoundException();
    }

    const overview = await analyticsRepository.getAnalyticsOverview({ alias, startDate, endDate });

    return {
        ...overview,
        total_clicks: parseInt(overview.total_clicks || '0'),
        unique_visitors: parseInt(overview.unique_visitors || '0'),
        active_days: parseInt(overview.active_days || '0'),
        avg_clicks_per_day: parseFloat(overview.avg_clicks_per_day || '0')
    };
}