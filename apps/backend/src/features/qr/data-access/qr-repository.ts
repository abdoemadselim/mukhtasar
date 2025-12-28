import { query } from "#lib/db/db-connection.js";
import type { QrCodeType, QrCodeInputType, QrAnalyticsType, QrAnalyticsInputType } from "#features/qr/types.js";

const qrRepository = {
    // QR Code Methods
    async createQrCode(qrData: QrCodeInputType): Promise<QrCodeType> {
        const result = await query(`
            INSERT INTO qr_code (user_id, url_id, foreground_color, background_color, frame_type, frame_text, frame_color, frame_text_color, logo_url)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING id, user_id, url_id, scan_count, created_at, updated_at
        `, [qrData.user_id, qrData.url_id, qrData.foreground_color, qrData.background_color, qrData.frame_type, qrData.frame_text, qrData.frame_color, qrData.frame_text_color, qrData.logo_url]);

        return result.rows[0];
    },

    async getQrCodeById(qrId: number): Promise<QrCodeType | undefined> {
        const result = await query(`
            SELECT id, user_id, url_id, scan_count, created_at, updated_at
            FROM qr_code
            WHERE id = $1
        `, [qrId]);

        return result.rows[0];
    },

    async getQrCodeByUrlId(urlId: number): Promise<QrCodeType | undefined> {
        const result = await query(`
            SELECT id, user_id, url_id, scan_count, created_at, updated_at
            FROM qr_code
            WHERE url_id = $1
        `, [urlId]);

        return result.rows[0];
    },

    async getUserQrCodes(userId: number): Promise<QrCodeType[]> {
        const result = await query(`
            SELECT qc.id, qc.user_id, qc.url_id, qc.scan_count, qc.created_at, qc.updated_at
            FROM qr_code qc
            JOIN url u ON qc.url_id = u.id
            WHERE qc.user_id = $1
            ORDER BY qc.created_at DESC
        `, [userId]);

        return result.rows;
    },

    async updateQrScanCount(qrId: number): Promise<void> {
        await query(`
            UPDATE qr_code
            SET scan_count = scan_count + 1, updated_at = NOW()
            WHERE id = $1
        `, [qrId]);
    },

    async deleteQrCode(qrId: number, userId: number): Promise<QrCodeType | undefined> {
        const result = await query(`
            DELETE FROM qr_code
            WHERE id = $1 AND user_id = $2
            RETURNING id, user_id, url_id, scan_count, created_at, updated_at
        `, [qrId, userId]);

        return result.rows[0];
    },

    async updateUrlHasQr(urlId: number): Promise<void> {
        await query(`
            UPDATE url
            SET has_qr = true
            WHERE id = $1
        `, [urlId]);
    },

    async getUrlById(urlId: number): Promise<{ id: number; alias: string; domain: string; original_url: string; short_url: string;/* qr_purpose_only: boolean; has_qr: boolean*/ } | undefined> {
        const result = await query(`
            SELECT id, alias, domain, original_url, short_url
            FROM url
            WHERE id = $1
        `, [urlId]);

        return result.rows[0];
    },

    async checkAliasExists(alias: string, domain: string): Promise<boolean> {
        const result = await query(`
            SELECT id FROM url
            WHERE alias = $1 AND domain = $2
        `, [alias, domain]);

        return result.rows.length > 0;
    },

    // QR Analytics Methods
    async createQrAnalytics(analyticsData: QrAnalyticsInputType): Promise<QrAnalyticsType> {
        const result = await query(`
            INSERT INTO qr_analytics (qr_id, ip_address, browser_name, os_name, device_type, referer)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id, qr_id, ip_address, scanned_at, browser_name, os_name, device_type, referer
        `, [analyticsData.qr_id, analyticsData.ip_address, analyticsData.browser_name, analyticsData.os_name, analyticsData.device_type, analyticsData.referer]);

        return result.rows[0];
    },

    async getQrAnalytics(qrId: number, limit: number = 100, offset: number = 0): Promise<QrAnalyticsType[]> {
        const result = await query(`
            SELECT id, qr_id, ip_address, scanned_at, browser_name, os_name, device_type, referer
            FROM qr_analytics
            WHERE qr_id = $1
            ORDER BY scanned_at DESC
            LIMIT $2 OFFSET $3
        `, [qrId, limit, offset]);

        return result.rows;
    },

    async getQrAnalyticsCount(qrId: number): Promise<number> {
        const result = await query(`
            SELECT COUNT(*) as count
            FROM qr_analytics
            WHERE qr_id = $1
        `, [qrId]);

        return parseInt(result.rows[0].count);
    },

    async getQrAnalyticsStats(qrId: number): Promise<{
        total_scans: number;
        unique_devices: number;
        top_browsers: Array<{ browser_name: string; count: number }>;
        top_os: Array<{ os_name: string; count: number }>;
        top_devices: Array<{ device_type: string; count: number }>;
    }> {
        const [totalScans, uniqueDevices, topBrowsers, topOs, topDevices] = await Promise.all([
            query(`SELECT COUNT(*) as count FROM qr_analytics WHERE qr_id = $1`, [qrId]),
            query(`SELECT COUNT(DISTINCT ip_address) as count FROM qr_analytics WHERE qr_id = $1`, [qrId]),
            query(`
                SELECT browser_name, COUNT(*) as count
                FROM qr_analytics
                WHERE qr_id = $1 AND browser_name IS NOT NULL
                GROUP BY browser_name
                ORDER BY count DESC
                LIMIT 5
            `, [qrId]),
            query(`
                SELECT os_name, COUNT(*) as count
                FROM qr_analytics
                WHERE qr_id = $1 AND os_name IS NOT NULL
                GROUP BY os_name
                ORDER BY count DESC
                LIMIT 5
            `, [qrId]),
            query(`
                SELECT device_type, COUNT(*) as count
                FROM qr_analytics
                WHERE qr_id = $1 AND device_type IS NOT NULL
                GROUP BY device_type
                ORDER BY count DESC
                LIMIT 5
            `, [qrId])
        ]);

        return {
            total_scans: parseInt(totalScans.rows[0].count),
            unique_devices: parseInt(uniqueDevices.rows[0].count),
            top_browsers: topBrowsers.rows,
            top_os: topOs.rows,
            top_devices: topDevices.rows
        };
    }
};

export default qrRepository;