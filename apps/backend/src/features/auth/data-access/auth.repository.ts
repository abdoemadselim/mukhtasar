import { NewUserType } from "@mukhtasar/shared";

// TODO: auth feature depends on user feature (is it OK?)
import type { UserType } from "#features/user/type.js";

import { query } from "#lib/db/db-connection.js";

const authRepository = {
    async createUser({ name, email, password }: Omit<NewUserType, "password_confirmation">): Promise<UserType> {
        const result = await query(`
            INSERT INTO users(name, email, password, verified)
            VALUES($1, $2, $3, false)
            RETURNING id, name, email
        `, [name, email, password])

        return result.rows[0]
    },

    async setUserVerified(userId: string): Promise<undefined> {
        const result = await query(`
            UPDATE users
            SET verified = true
            WHERE id = $1
        `, [userId])

        return result.rows[0]
    }
}


export default authRepository