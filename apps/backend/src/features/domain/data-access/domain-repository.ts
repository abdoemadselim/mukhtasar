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
    },

    async checkDomainExists(domain: string) {
        const result = await query(`
            SELECT id FROM custom_domain
            WHERE domain = $1
        `, [domain]);

        return result.rows[0];
    },

    async addDomain({ domain, userId }: { domain: string, userId: number }) {
        const result = await query(`
            INSERT INTO custom_domain (domain, user_id, status)
            VALUES ($1, $2, 'pending')
            RETURNING id, domain, status
        `, [domain, userId]);

        return result.rows[0];
    },

    async updateDomainStatus({ domainId, status }: { domainId: number, status: string }) {
        const result = await query(`
            UPDATE custom_domain
            SET status = $1, updated_at = NOW()
            WHERE id = $2
            RETURNING id, domain, status, updated_at
        `, [status, domainId]);

        return result.rows[0];
    }
};

export default domainRepository;