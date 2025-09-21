import { query } from "#lib/db/db-connection.js";

const domainRepository = {
    async checkUserOwnsDomain({ userId, domain }: { userId: number, domain: string }) {
        const result = await query(`
            SELECT id FROM custom_domain
            WHERE user_id = $1 AND domain = $2
        `, [userId, domain]);

        return result.rows[0];
    },

    async getUserDomains(userId: number) {
        const result = await query(`
            SELECT id, domain, status, created_at, domain_type
            FROM custom_domain
            WHERE user_id = $1
            ORDER BY created_at DESC
        `, [userId]);

        return result.rows;
    },

    async getUserActiveDomains(userId: number) {
        const result = await query(`
            SELECT id, domain, status, created_at, domain_type
            FROM custom_domain
            WHERE user_id = $1 AND status = 'active'
            ORDER BY created_at DESC
        `, [userId]);

        return result.rows;
    },

    async checkDomainExists(domain: string) {
        const result = await query(`
            SELECT id FROM custom_domain
            WHERE domain = $1
        `, [domain]);

        return result.rows[0];
    },

    async addDomain({ domain, userId, domainType }: { domain: string, userId: number, domainType: string }) {
        const result = await query(`
            INSERT INTO custom_domain (domain, user_id, status, domain_type)
            VALUES ($1, $2, 'pending', $3)
            RETURNING id, domain, status, domain_type
        `, [domain, userId, domainType]);

        return result.rows[0];
    },

    async getDomainById(domainId: number) {
        const result = await query(`
            SELECT id, domain, status, created_at, user_id, domain_type
            FROM custom_domain
            WHERE id = $1
        `, [domainId]);

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
    },

    async deleteDomain({ domainId, userId }: { domainId: number, userId: number }) {
        const result = await query(`
            DELETE FROM custom_domain
            WHERE id = $1 AND user_id = $2
            RETURNING id, domain, status
        `, [domainId, userId]);

        return result.rows[0];
    },
};

export default domainRepository;