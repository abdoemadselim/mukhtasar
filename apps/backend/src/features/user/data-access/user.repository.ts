import { UserType } from "#root/features/user/types.js";
import { query } from "#lib/db/db-connection.js";

const userRepository = {
    // Do we need password here all the time? What about creating a different query 
    async getUserByEmail(email: string): Promise<UserType> {
        const result = await query(`
                SELECT id, name, password, email, verified
                FROM users
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
    },

    async updatePassword({ email, password }: { email: string, password: string }): Promise<UserType> {
        const result = await query(
            `
                UPDATE users
                SET password = $1
                WHERE email = $2
                RETURNING id
            `,
            [password, email]
        )

        return result.rows[0];
    },

    async updateUser({ id, name, verified }: {
        id: number;
        name?: string;
        verified?: boolean;
    }): Promise<UserType> {
        const result = await query(
            `
            UPDATE users
            SET name = $1, verified = $2
            WHERE id = $3
            RETURNING id, name, email, verified
        `,
            [name, verified, id]
        );
        return result.rows[0];
    }
}


export default userRepository