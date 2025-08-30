// apps/backend/src/features/analytics/data-access/analytics.repository.ts
import { query } from "#lib/db/db-connection.js";
import { AnalyticsEventInput } from "#features/analytics/types";

interface AnalyticsParams {
    alias: string;
    startDate: string;
    endDate: string;
}

interface StatsParams extends AnalyticsParams { }

interface ClicksOverTimeParams extends AnalyticsParams {
    groupBy: string;
}

interface RefererStatsParams extends AnalyticsParams {
    limit: number;
}

interface HourlyStatsParams extends AnalyticsParams {
    timezone: string;
}

const analyticsRepository = {
    async createEvent(analyticsEvent: AnalyticsEventInput): Promise<undefined> {
        const { url_id, ip_address, browser_name, os_name, device_type, referer } = analyticsEvent;
        const result = await query(`
            INSERT INTO url_analytics(url_id, ip_address, browser_name, os_name, device_type, referer)
            VALUES($1, $2, $3, $4, $5, $6)
            `,
            // @ts-ignore
            [url_id, ip_address, browser_name, os_name, device_type, referer]
        );

        return result.rows[0];
    },

    async getAnalyticsOverview({ alias, startDate, endDate }: AnalyticsParams) {
        // Why NULLIF? to avoid dividing over 0 to prevent throwing an error (instead return NULL) -- anything/NULL = NULL
        // It expects start, end in UTC timezone
        const result = await query(`
            SELECT 
                COUNT(*) as total_clicks,
                COUNT(DISTINCT ip_address) as unique_visitors,
                COUNT(DISTINCT DATE(clicked_at)) as active_days,
                ROUND(COUNT(*)::decimal / NULLIF(COUNT(DISTINCT DATE(clicked_at)), 0), 2) as avg_clicks_per_day
            FROM url_analytics ua
            JOIN url u ON ua.url_id = u.id
            WHERE u.alias = $1
            AND ua.clicked_at >= $2::timestamptz
            AND ua.clicked_at <= $3::timestamptz
        `, [alias, startDate, endDate]);

        return result.rows[0];
    },

    async getBrowserStats({ alias, startDate, endDate }: StatsParams) {
        const result = await query(`
            SELECT 
                COALESCE(browser_name, 'Unknown') as browser,
                COUNT(*)::INTEGER as visitors,
                ROUND((COUNT(*) * 100.0 / SUM(COUNT(*)) OVER()), 2)::FLOAT as percentage
            FROM url_analytics ua
            JOIN url u ON ua.url_id = u.id
            WHERE u.alias = $1
            AND ua.clicked_at >= $2::timestamptz 
            AND ua.clicked_at <= $3::timestamptz
            GROUP BY browser_name
            ORDER BY visitors DESC
        `, [alias, startDate, endDate]);

        return result.rows;
    },

    async getDeviceStats({ alias, startDate, endDate }: StatsParams) {
        const result = await query(`
            SELECT 
                COALESCE(device_type, 'Desktop') as device,
                COUNT(*) as visitors,
                ROUND((COUNT(*) * 100.0 / SUM(COUNT(*)) OVER()), 2) as percentage
            FROM url_analytics ua
            JOIN url u ON ua.url_id = u.id
            WHERE u.alias = $1
            AND ua.clicked_at >= $2::timestamptz 
            AND ua.clicked_at <= $3::timestamptz
            GROUP BY device_type
            ORDER BY visitors DESC
        `, [alias, startDate, endDate]);

        return result.rows;
    },

    async getClicksOverTime({ alias, startDate, endDate, groupBy }: ClicksOverTimeParams) {
        let dateFormat: string;
        let dateGroup: string;

        switch (groupBy) {
            case 'hour':
                dateFormat = 'YYYY-MM-DD HH24:00';
                dateGroup = "DATE_TRUNC('hour', clicked_at)";
                break;
            case 'day':
                dateFormat = 'YYYY-MM-DD';
                dateGroup = "DATE_TRUNC('day', clicked_at)";
                break;
            case 'week':
                dateFormat = 'YYYY-"W"WW';
                dateGroup = "DATE_TRUNC('week', clicked_at)";
                break;
            case 'month':
                dateFormat = 'YYYY-MM';
                dateGroup = "DATE_TRUNC('month', clicked_at)";
                break;
            default:
                dateFormat = 'YYYY-MM-DD';
                dateGroup = "DATE_TRUNC('day', clicked_at)";
        }

        const result = await query(`
            SELECT 
                TO_CHAR(${dateGroup}, '${dateFormat}') as date,
                COUNT(*) as clicks,
                COUNT(DISTINCT ip_address) as unique_visitors
            FROM url_analytics ua
            JOIN url u ON ua.url_id = u.id
            WHERE u.alias = $1
            AND ua.clicked_at >= $2::timestamptz 
            AND ua.clicked_at <= $3::timestamptz
            GROUP BY ${dateGroup}
            ORDER BY ${dateGroup}
        `, [alias, startDate, endDate]);

        return result.rows;
    },

    async getGeographicStats({ alias, startDate, endDate }: StatsParams) {
        // Note: This is a simplified implementation. In production, you'd want to use a GeoIP service
        // to convert IP addresses to countries. For now, this returns mock data structure.
        const result = await query(`
            SELECT 
            ip_address::inet as ip,
            COUNT(*) as clicks
            FROM url_analytics ua
            JOIN url u ON ua.url_id = u.id
            WHERE u.alias = $1
            AND ua.clicked_at >= $2::timestamptz 
            AND ua.clicked_at <= $3::timestamptz
            AND ip_address != 'Unknown'
            GROUP BY ip_address::inet
            ORDER BY clicks DESC
            LIMIT 10
        `, [alias, startDate, endDate]);

        // Mock country mapping - in production, use a proper GeoIP service
        const mockCountries = ['السعودية', 'الإمارات', 'مصر', 'قطر', 'الكويت', 'الأردن', 'لبنان', 'العراق'];
        const mockFlags = ['🇸🇦', '🇦🇪', '🇪🇬', '🇶🇦', '🇰🇼', '🇯🇴', '🇱🇧', '🇮🇶'];

        return result.rows.map((row, index) => ({
            country: mockCountries[index % mockCountries.length] || 'غير محدد',
            clicks: parseInt(row.clicks),
            flag: mockFlags[index % mockFlags.length] || '🏳️'
        }));
    },

    async getRefererStats({ alias, startDate, endDate, limit }: RefererStatsParams) {
        const result = await query(`
            SELECT 
                CASE 
                    WHEN referer = 'Unknown' OR referer IS NULL THEN 'مباشر'
                    ELSE REGEXP_REPLACE(
                        REGEXP_REPLACE(referer, '^https?://(www\.)?', ''),
                        '/.*$', ''
                    )
                END as website,
                COUNT(*) as visitors
            FROM url_analytics ua
            JOIN url u ON ua.url_id = u.id
            WHERE u.alias = $1
            AND ua.clicked_at >= $2::timestamptz 
            AND ua.clicked_at <= $3::timestamptz
            GROUP BY website
            ORDER BY visitors DESC
            LIMIT $4    
        `,
            // @ts-ignore
            [alias, startDate, endDate, limit]
        );

        return result.rows;
    },

    async getHourlyStats({ alias, startDate, endDate, timezone }: HourlyStatsParams) {
        const result = await query(`
            SELECT 
                EXTRACT(HOUR FROM clicked_at AT TIME ZONE $5) as hour,
                COUNT(*) as clicks
            FROM url_analytics ua
            JOIN url u ON ua.url_id = u.id
            WHERE u.alias = $1
            AND ua.clicked_at >= $2::timestamptz 
            AND ua.clicked_at <= $3::timestamptz
            GROUP BY EXTRACT(HOUR FROM clicked_at AT TIME ZONE $4)
            ORDER BY hour
        `, [alias, startDate, endDate, timezone]);

        // Fill missing hours with 0 clicks
        const hourlyData = Array.from({ length: 24 }, (_, i) => ({
            hour: i.toString().padStart(2, '0'),
            clicks: 0
        }));

        result.rows.forEach(row => {
            const hour = parseInt(row.hour);
            if (hour >= 0 && hour < 24) {
                hourlyData[hour].clicks = parseInt(row.clicks);
            }
        });

        return hourlyData;
    }
}

export default analyticsRepository;