import { query } from "#lib/db/db-connection.js";
import type { Token, TokenInput, TokenWithUrlType } from "#features/token/types";

const tokenRepository = {
    async getTokenWithUrl(token_hash: string): Promise<TokenWithUrlType | undefined> {
        const result = await query(
            `SELECT api_token.id, api_token.user_id, can_create, can_update, can_delete, alias, domain
             FROM api_token JOIN url
             ON api_token.user_id = url.user_id
             WHERE api_token.token_hash = $1`,

            [token_hash]
        )

        return result.rows[0];
    },

    async getTokenByTokenHash(token_hash: string) {
        const result = await query(
            `SELECT id, user_id, label, can_create, can_update, can_delete, created_at
             FROM api_token
            WHERE token_hash = $1`,
            [token_hash]
        );

        return result.rows[0];
    },

    async createToken({ tokenHash, can_create, can_update, can_delete, label, user_id }: TokenInput & { tokenHash: string }): Promise<Token | undefined> {

        const result = await query(
            `INSERT INTO api_token(user_id, token_hash, label, can_create, can_update, can_delete)
             VALUES($1, $2, $3, $4, $5, $6)
             RETURNING id, user_id, label, can_create, can_update, can_delete, created_at`,
            // @ts-ignore
            [user_id, tokenHash, label, can_create, can_update, can_delete]
        );

        return result.rows[0];
    },

    async getTokensByUserId(user_id: string): Promise<Token[] | undefined> {
        const result = await query(
            `SELECT id, user_id, label, can_create, can_update, can_delete, created_at
             FROM api_token
            WHERE user_id = $1`,
            [user_id]
        );

        return result.rows;
    },

    async getTokensPage({ user_id, page, page_size }: { user_id: number, page: number, page_size: number }) {
        const offset = page * page_size;

        const tokens = query(
            `SELECT id, user_id, label, can_create, can_update, can_delete, created_at
             FROM api_token
             WHERE user_id = $1
             ORDER BY created_at DESC
             OFFSET $2 LIMIT $3`,
            //@ts-ignore
            [user_id, offset, page_size]
        );

        const total_pages_result = query(
            "SELECT COUNT(*) AS total FROM api_token WHERE user_id = $1",
            // @ts-ignore
            [user_id]
        )

        const result = await Promise.all([tokens, total_pages_result]);
        return { tokens: result[0].rows, total: Number(result[1].rows[0].total) };
    },

    async getTokenById(tokenId: string): Promise<Token | undefined> {
        const result = await query(
            `SELECT id, user_id, label, can_create, can_update, can_delete, created_at
             FROM api_token
            WHERE id = $1`,
            [tokenId]
        );

        return result.rows[0];
    },


    async updateToken({
        tokenId,
        userId,
        updates
    }: { tokenId: string, userId: string, updates: Partial<Omit<TokenInput, "userId">> }): Promise<Token> {
        const fields: string[] = [];
        const values: any[] = [];
        let i = 1;

        for (const key of Object.keys(updates)) {
            // @ts-ignore
            if (updates[key] !== undefined) {
                fields.push(`${key} = $${i}`);
                // @ts-ignore
                values.push(updates[key]);
                i++;
            }
        }

        values.push(tokenId, userId); // last two for WHERE clause

        const result = await query(
            `UPDATE api_token
            SET ${fields.join(", ")}
            WHERE id = $${i} AND user_id = $${i + 1}
            RETURNING id, user_id, label, can_create, can_update, can_delete, created_at`, values);

        return result.rows[0];
    },

    async deleteToken(tokenId: string): Promise<Token> {
        const result = await query(
            `
                DELETE
                FROM api_token
                WHERE id = $1
                RETURNING id, user_id, label, can_create, can_update, can_delete
            `, [tokenId]
        )

        return result.rows[0]
    }
}


export default tokenRepository