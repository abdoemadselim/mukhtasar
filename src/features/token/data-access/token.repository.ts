import { query } from "#lib/db/db-connection.js";
import type { TokenWithUrlType } from "#features/token/types.js";

const tokenRepository = {
    async getTokenWithUrl({ token }: { token: string }): Promise<TokenWithUrlType | undefined> {
        const result = await query(
            `SELECT api_token.id, can_create, can_update, can_delete, alias, domain
             FROM api_token JOIN url
             ON api_token.user_id = url.user_id
             WHERE api_token.token_string = $1`,

            [token]
        )

        return result.rows[0];
    }
}


export default tokenRepository