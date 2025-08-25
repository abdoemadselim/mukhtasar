import type { UrlInputType, UrlType } from "#features/url/types.js";
import type { ParamsType } from "@mukhtasar/shared"; 

import { query } from "#lib/db/db-connection.js";

const urlRepository = {
    async getUrlByAliasAndDomain({ alias, domain }: ParamsType): Promise<UrlType | undefined> {
        const result = await query(
            "SELECT alias, domain, original_url, short_url, click_count FROM url WHERE alias = $1 AND domain = $2",
            [alias, domain]
        );

        if(result.rows.length){
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
            `SELECT SETVAL('url_unique_id', NEXTVAL('url_unique_id') + ${batch_size} - 1) - ${batch_size} + 1 AS batch_start`,
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