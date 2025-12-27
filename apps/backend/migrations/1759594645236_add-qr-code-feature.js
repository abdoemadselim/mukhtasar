/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
    // Add QR-related fields to url table
    pgm.addColumn('url', {
        qr_purpose_only: {
            type: 'boolean',
            default: false,
            comment: 'TRUE if created automatically for QR-only use'
        },
        has_qr: {
            type: 'boolean',
            default: false,
            comment: 'TRUE if a QR exists for this short link'
        }
    });

    // Create qr_code table
    pgm.createTable('qr_code', {
        id: 'id',
        user_id: {
            type: 'integer',
            references: 'users(id)',
            onDelete: 'CASCADE',
            notNull: true,
        },
        url_id: {
            type: 'integer',
            references: 'url(id)',
            onDelete: 'CASCADE',
            unique: true,
            notNull: true,
        },
        scan_count: {
            type: 'bigint',
            default: 0,
        },
        created_at: {
            type: 'timestamptz',
            default: pgm.func('CURRENT_TIMESTAMP'),
        },
        updated_at: {
            type: 'timestamptz',
            default: pgm.func('CURRENT_TIMESTAMP'),
        },
    });

    // Create qr_analytics table
    pgm.createTable('qr_analytics', {
        id: 'id',
        qr_id: {
            type: 'integer',
            references: 'qr_code(id)',
            onDelete: 'CASCADE',
            notNull: true,
        },
        ip_address: {
            type: 'varchar(45)',
        },
        scanned_at: {
            type: 'timestamptz',
            default: pgm.func('CURRENT_TIMESTAMP'),
        },
        browser_name: {
            type: 'varchar(50)',
        },
        os_name: {
            type: 'varchar(50)',
        },
        device_type: {
            type: 'varchar(20)',
        },
        referer: {
            type: 'varchar(2000)',
        },
    });

    // Create indexes for better performance
    pgm.createIndex('qr_code', 'user_id');
    pgm.createIndex('qr_code', 'url_id');
    pgm.createIndex('qr_analytics', 'qr_id');
    pgm.createIndex('qr_analytics', 'scanned_at');
    pgm.createIndex('qr_analytics', ['qr_id', 'scanned_at']);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    // Drop tables in reverse order
    pgm.dropTable('qr_analytics');
    pgm.dropTable('qr_code');

    // Remove columns from url table
    pgm.dropColumn('url', 'has_qr');
    pgm.dropColumn('url', 'qr_purpose_only');
};
