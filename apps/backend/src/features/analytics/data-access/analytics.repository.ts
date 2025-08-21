import { query } from "#lib/db/db-connection.js";
import { AnalyticsEventInput } from "../types";

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
    }
}


export default analyticsRepository