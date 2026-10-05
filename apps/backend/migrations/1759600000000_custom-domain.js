/**
 * The domain feature reads and writes `custom_domain`.
 * The first migration created an unused `domain` table with a different shape.
 *
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 */
export const up = (pgm) => {
    pgm.createTable('custom_domain', {
        id: 'id',
        user_id: {
            type: 'integer',
            notNull: true,
            references: 'users(id)',
            onDelete: 'CASCADE',
        },
        domain: {
            type: 'varchar(100)',
            notNull: true,
            unique: true,
        },
        status: {
            type: 'varchar(20)',
            notNull: true,
            default: 'pending',
        },
        cloudflare_hostname_id: {
            type: 'varchar(64)',
        },
        created_at: {
            type: 'timestamptz',
            notNull: true,
            default: pgm.func('CURRENT_TIMESTAMP'),
        },
        updated_at: {
            type: 'timestamptz',
            notNull: true,
            default: pgm.func('CURRENT_TIMESTAMP'),
        },
    });

    pgm.createIndex('custom_domain', 'user_id');
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 */
export const down = (pgm) => {
    pgm.dropTable('custom_domain');
};
