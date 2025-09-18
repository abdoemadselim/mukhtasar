import { query } from "#lib/db/db-connection.js";

const domainRepository = {
    async checkUserOwnsDomain({ userId, domain }: { userId: number, domain: string }) {
        const result = await query(`
            SELECT id FROM domain
            WHERE user_id = $1 AND domain_string = $2
        `, [String(userId), domain]);

        return result.rows[0];
    },

    async getUserDomains(userId: number) {
        const result = await query(`
            SELECT id, domain, status, created_at
            FROM custom_domain
            WHERE user_id = $1
            ORDER BY created_at DESC
        `, [String(userId)]);

        return result.rows;
    }
};

export default domainRepository;