import analyticsRepository from "#features/analytics/data-access/analytics.repository.js";
import urlRepository from "#features/url/data-access/url.repository.js";
import { AnalyticsEventInput } from "#features/analytics/types.js";

export async function updateAnalytics({ analyticsEvent, url_alias }: { analyticsEvent: Omit<AnalyticsEventInput, "url_id">, url_alias: string }) {
    const url = await urlRepository.getUrlByAlias(url_alias)

    // @ts-ignore
    analyticsEvent.url_id = url.d;
    
    analyticsRepository.createEvent(analyticsEvent as AnalyticsEventInput);
}