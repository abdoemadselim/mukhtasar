import { query } from "#lib/db/db-connection.js";
import type { Token, TokenInput, TokenWithUrlType } from "#features/token/types.js";

const tokenRepository = {
    async getTokenWithUrl({ token }: { token: string }): Promise<TokenWithUrlType | undefined> {
        const result = await query(
            `SELECT api_token.id, api_token.user_id, can_create, can_update, can_delete, alias, domain
             FROM api_token JOIN url
             ON api_token.user_id = url.user_id
             WHERE api_token.token_string = $1`,

            [token]
        )

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

    async getTokensByUserId(userId: string): Promise<Token[] | undefined> {
        const result = await query(
            `SELECT id, user_id, label, can_create, can_update, can_delete, created_at
             FROM api_token
            WHERE user_id = $1`,
            [userId]
        );

        return result.rows;
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