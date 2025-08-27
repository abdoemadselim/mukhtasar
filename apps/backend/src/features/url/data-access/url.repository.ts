import type { UrlInputType, UrlType } from "#features/url/types.js";
import type { ParamsType } from "@mukhtasar/shared";

import { query } from "#lib/db/db-connection.js";

const urlRepository = {
    async getUrlsByUserId(user_id: number) {
        console.log(user_id)
        const result = await query(
            "SELECT id, alias, domain, original_url, short_url, click_count, created_at FROM url WHERE user_id = $1",
            [String(user_id)]
        );

        return result.rows;
    },

    async getUrlsPage({ user_id, page, page_size }: { user_id: number, page: number, page_size: number }) {
        const offset = page * page_size;
        const urls_result = query(
            `SELECT id, alias, domain, original_url, short_url, click_count, created_at 
            FROM url 
            WHERE user_id = $1 
            ORDER BY created_at
            OFFSET $2 LIMIT $3
            
            `,
            // @ts-ignore
            [user_id, offset, page_size]
        )

        const total_pages_result = query(
            "SELECT COUNT(*) as total FROM url WHERE user_id = $1",
            // @ts-ignore
            [user_id]
        )

        const result = await Promise.all([urls_result, total_pages_result]);
        return {urls: result[0].rows, total: Number(result[1].rows[0].total)};
    },

    async getUrlByAliasAndDomain({ alias, domain }: ParamsType): Promise<UrlType | undefined> {
        const result = await query(
            "SELECT alias, domain, original_url, short_url, click_count FROM url WHERE alias = $1 AND domain = $2",
            [alias, domain]
        );

        if (result.rows.length) {
            result.rows[0].click_count = Number(result.rows[0].click_count)
        }
        return result.rows[0];
    },

    async getUrlByAlias(alias: string): Promise<UrlType> {
        const result = await query(
            "SELECT id, original_url FROM url WHERE alias = $1",
            [alias]
        );

        return result.rows[0];
    },

    async getUrlByOriginalUrl({ original_url }: { original_url: string }): Promise<UrlType> {
        const result = await query(
            "SELECT short_url, alias, domain, original_url, created_at FROM url WHERE url_hash=DECODE(MD5($1), 'hex')",
            [original_url]
        );

        return result.rows[0];
    },

    async getIdBatch(batch_size: number) {
        const result = await query(
            `SELECT SETVAL('url_unique_id', NEXTVAL('url_unique_id') + $1 - 1) - $2 + 1 AS batch_start`,
            // @ts-ignore
            [batch_size, batch_size]
        );

        return result.rows[0];
    },

    async createUrl(newUrl: UrlInputType) {
        const fields: string[] = [];
        const values: any[] = [];
        const placeholders: string[] = [];
        let i = 1;

        for (const key of Object.keys(newUrl)) {
            // @ts-ignore
            if (newUrl[key] !== undefined) {
                fields.push(key);                  // just the column name

                placeholders.push(`$${i}`);        // parameter placeholder
                // @ts-ignore
                values.push(newUrl[key]);          // actual value
                i++;
            }
        }
        const result = await query(
            `
        INSERT INTO url (${fields.join(", ")})
        VALUES (${placeholders.join(", ")})
        RETURNING short_url, created_at
        `,
            values
        );

        return result.rows[0];
    },

    async deleteUrl({ alias, domain }: ParamsType) {
        const result = await query(
            `DELETE FROM url
             WHERE alias = $1 AND domain = $2
            `,
            [alias, domain]
        );

        return result.rows[0];
    },

    async updateUrl({ alias, domain }: ParamsType, original_url: string) {
        const result = await query(`
            UPDATE url
            SET original_url = $1
            WHERE alias = $2 AND domain = $3
            `,
            [original_url, alias, domain]
        );

        return result.rows[0];
    },

    async getUrlClickCounts({ alias, domain }: ParamsType) {
        const result = await query(`
            SELECT click_count FROM url
            WHERE alias = $1 AND domain = $2
            `,
            [alias, domain]
        );

        return Number(result.rows[0]?.click_count);
    }
}


export default urlRepository