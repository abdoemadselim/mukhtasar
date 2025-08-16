import { query } from "#lib/db/db-connection.js";
import type { TokenWithUrlType } from "#features/token/types.js";

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

    async createToken({ tokenHash, can_create, can_update, can_delete, label, user_id }: {
        tokenHash: string,
        can_create: boolean,
        can_update: boolean,
        can_delete: boolean,
        label: string
        user_id: string
    }) {
        // const result = await query(
        //     `INSERT INTO api_token(user_id, token_string, label, can_create, can_update, can_delete)
        //      VALUES($1, $2, $3, $4, $5)`,
        //     [user_id, tokenHash, label, can_create, can_update, can_delete]
        // )

        // return result.rows[0]
    }
}


export default tokenRepository