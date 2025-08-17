import { UserType } from "#features/user/type.js";
import {  query } from "#lib/db/db-connection.js";

const userRepository = {
    // Do we need password here all the time? What about creating a different query 
    async getUserByEmail(email: string): Promise<UserType> {
        const result = await query(`
                SELECT id, name, password, email, verified FROM users
                WHERE email = $1
            `,
            [email]
        )

        return result.rows[0];
    },

    async getUserById(id: string): Promise<UserType> {
        const result = await query(
            `
                SELECT id, name, email, verified FROM users
                WHERE id = $1
            `,
            [id]
        )

        return result.rows[0];
    }
}


export default userRepository