import { query } from "#lib/db/db-connection.js";
import type { UrlType } from "#features/url/types.js";
import type { ParamsType, ToUpdateUrlType } from "#features/url/domain/url-schemas.js";

const urlRepository = {
    async getUrlByAliasAndDomain({ alias, domain }: ParamsType): Promise<UrlType | undefined> {
        const result = await query(
            "SELECT alias, domain, original_url, short_url, click_count FROM url WHERE alias = $1 AND domain = $2",
            [alias, domain]
        );

        return result.rows[0];
    },

    async getUrlByAlias({ alias }: { alias: string }): Promise<UrlType | undefined> {
        const result = await query(
            "SELECT short_url, alias, domain, original_url, created_at FROM url WHERE alias = $1",
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
            `SELECT SETVAL('url_unique_id', NEXTVAL('url_unique_id') + ${batch_size} - 1) - ${batch_size} + 1 AS batch_start`,
        );

        return result.rows[0];
    },

    async createUrl(newUrl: UrlType) {
        const { domain, alias, original_url, user_id, description } = newUrl
        const result = await query(
            `INSERT INTO url
             (alias, domain, original_url, user_id, description) 
             VALUES($1, $2, $3, $4, $5)
             RETURNING short_url, created_at
            `,
            [alias, domain, original_url, String(user_id), description]
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