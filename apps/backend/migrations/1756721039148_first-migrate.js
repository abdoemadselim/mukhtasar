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
    // Create users table
    pgm.createTable('users', {
        id: 'id',
        created_at: {
            type: 'timestamptz',
            default: pgm.func('CURRENT_TIMESTAMP'),
        },
        email: {
            type: 'varchar(200)',
            unique: true,
            notNull: true,
        },
        password: {
            type: 'char(60)',
            unique: true,
            notNull: true,
        },
        name: {
            type: 'varchar(40)',
            notNull: true,
        },
        verified: {
            type: 'boolean',
            default: false,
        },
    });

    // Create api_token table
    pgm.createTable('api_token', {
        id: 'id',
        user_id: {
            type: 'integer',
            references: 'users(id)',
            onDelete: 'CASCADE',
        },
        token_hash: {
            type: 'char(64)',
            unique: true,
            notNull: true,
        },
        label: {
            type: 'varchar(50)',
            notNull: true,
        },
        created_at: {
            type: 'timestamptz',
            default: pgm.func('CURRENT_TIMESTAMP'),
        },
        updated_at: {
            type: 'timestamptz',
            default: pgm.func('CURRENT_TIMESTAMP'),
        },
        last_used: {
            type: 'timestamptz',
        },
        can_create: {
            type: 'boolean',
            default: false,
        },
        can_update: {
            type: 'boolean',
            default: false,
        },
        can_delete: {
            type: 'boolean',
            default: false,
        },
    });

    // Create url table
    pgm.createTable('url', {
        id: 'id',
        alias: {
            type: 'varchar(20)',
            notNull: true,
        },
        domain: {
            type: 'varchar(100)',
            notNull: true,
        },
        original_url: {
            type: 'varchar(2000)',
            check: "original_url ~* '^https?://'",
        },
        user_id: {
            type: 'integer',
            references: 'users(id)',
            onDelete: 'CASCADE',
        },
        click_count: {
            type: 'bigint',
            default: 0,
        },
        analytics_enabled: {
            type: 'boolean',
            default: true,
        },
        created_at: {
            type: 'timestamptz',
            default: pgm.func('CURRENT_TIMESTAMP'),
        },
        description: {
            type: 'varchar(300)',
        },
        short_url: {
            type: 'varchar(200)',
            generated: {
                precedence: 'ALWAYS',
                expression: "('https://' || domain || '/' || alias)",
                stored: true,
            },
        },
    });

    // Add unique constraint on alias and domain
    pgm.addConstraint('url', 'url_alias_domain_unique', {
        unique: ['alias', 'domain'],
    });

    // Add url_hash column with generated expression
    pgm.addColumn('url', {
        url_hash: {
            type: 'bytea',
            generated: {
                precedence: 'ALWAYS',
                expression: "DECODE(MD5(original_url), 'hex')",
                stored: true,
            },
        },
    });

    // Create indexes
    pgm.createIndex('url', 'url_hash', {
        method: 'hash',
        name: 'unique_url_hash',
    });

    pgm.createIndex('url', 'user_id');

    // Create url_analytics table
    pgm.createTable('url_analytics', {
        id: 'id',
        url_id: {
            type: 'integer',
            references: 'url(id)',
            onDelete: 'CASCADE',
        },
        ip_address: {
            type: 'varchar(45)',
        },
        clicked_at: {
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

    pgm.createIndex('url_analytics', ['url_id', 'clicked_at'], {
        name: 'idx_url_analytics_url_id_clicked_at',
    });

    pgm.createIndex('url_analytics', ['clicked_at', 'url_id'], {
        name: 'idx_url_analytics_clicked_at_url_id',
    });

    // Create domain table
    pgm.createTable('domain', {
        id: 'id',
        user_id: {
            type: 'integer',
            references: 'users(id)',
            onDelete: 'CASCADE',
        },
        date_added: {
            type: 'timestamptz',
            default: pgm.func('CURRENT_TIMESTAMP'),
        },
        domain_string: {
            type: 'varchar(100)',
            notNull: true,
        },
    });

    // Create sequence
    pgm.createSequence('url_unique_id', {
        start: 1,
        increment: 1,
        cache: 1000,
    });

    // Create the stored functions using SQL
    pgm.sql(`
    CREATE OR REPLACE FUNCTION create_sample_urls_for_user(
        p_user_id INTEGER,
        p_domain VARCHAR(100) DEFAULT 'minimo.com',
        p_url_count INTEGER DEFAULT 20
    )
    RETURNS TABLE(
        created_alias VARCHAR(20),
        created_short_url VARCHAR(200),
        created_original_url VARCHAR(2000)
    )
    LANGUAGE plpgsql
    AS $$
    DECLARE
        sample_urls TEXT[] := ARRAY[
            'https://github.com/microsoft/TypeScript',
            'https://reactjs.org/docs/getting-started.html',
            'https://nodejs.org/en/docs/guides/',
            'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
            'https://tailwindcss.com/docs/installation',
            'https://nextjs.org/docs/getting-started',
            'https://postgresql.org/docs/current/',
            'https://redis.io/documentation',
            'https://expressjs.com/en/4x/api.html',
            'https://www.prisma.io/docs',
            'https://vercel.com/docs/deployments',
            'https://docker.com/get-started',
            'https://kubernetes.io/docs/home/',
            'https://aws.amazon.com/documentation/',
            'https://cloud.google.com/docs',
            'https://stackoverflow.com/questions/tagged/javascript',
            'https://medium.com/@developer/web-development-trends',
            'https://dev.to/t/webdev',
            'https://hashnode.com/developers',
            'https://youtube.com/watch?v=dQw4w9WgXcQ',
            'https://linkedin.com/in/developer-profile',
            'https://twitter.com/developer',
            'https://facebook.com/developer.page',
            'https://instagram.com/tech_account',
            'https://reddit.com/r/webdev'
        ];
        
        sample_descriptions TEXT[] := ARRAY[
            'TypeScript Documentation',
            'React Getting Started Guide',
            'Node.js Developer Guides', 
            'JavaScript MDN Reference',
            'Tailwind CSS Setup',
            'Next.js Documentation',
            'PostgreSQL Official Docs',
            'Redis Documentation',
            'Express.js API Reference',
            'Prisma Database Toolkit',
            'Vercel Deployment Guide',
            'Docker Getting Started',
            'Kubernetes Documentation',
            'AWS Documentation Hub',
            'Google Cloud Platform Docs',
            'JavaScript Stack Overflow',
            'Web Development Trends',
            'Dev.to Web Development',
            'Hashnode Developer Blog',
            'Never Gonna Give You Up',
            'Professional LinkedIn Profile',
            'Developer Twitter Account',
            'Developer Facebook Page',
            'Tech Instagram Account',
            'Web Development Reddit'
        ];

        current_url TEXT;
        current_desc TEXT;
        generated_alias VARCHAR(20);
        alias_attempts INTEGER;
        max_attempts INTEGER := 10;
        i INTEGER;
    BEGIN
        -- Validate user exists
        IF NOT EXISTS (SELECT 1 FROM users WHERE id = p_user_id) THEN
            RAISE EXCEPTION 'User with ID % does not exist', p_user_id;
        END IF;

        -- Create URLs
        FOR i IN 1..p_url_count LOOP
            -- Get URL and description (cycle through if we need more than array length)
            current_url := sample_urls[((i - 1) % array_length(sample_urls, 1)) + 1];
            current_desc := sample_descriptions[((i - 1) % array_length(sample_descriptions, 1)) + 1];
            
            -- Generate unique alias with retry logic
            alias_attempts := 0;
            LOOP
                alias_attempts := alias_attempts + 1;
                
                -- Generate random alias (format: 3 letters + 3-4 numbers)
                generated_alias := 
                    chr(97 + floor(random() * 26)::int) ||  -- Random letter a-z
                    chr(97 + floor(random() * 26)::int) ||  -- Random letter a-z  
                    chr(97 + floor(random() * 26)::int) ||  -- Random letter a-z
                    floor(random() * 1000 + 100)::text;     -- Random number 100-999
                
                -- Check if alias is unique for this domain
                IF NOT EXISTS (
                    SELECT 1 FROM url 
                    WHERE alias = generated_alias AND domain = p_domain
                ) THEN
                    EXIT; -- Alias is unique, break the loop
                END IF;
                
                -- If we've tried too many times, add random suffix
                IF alias_attempts >= max_attempts THEN
                    generated_alias := generated_alias || floor(random() * 100)::text;
                    EXIT;
                END IF;
            END LOOP;

            -- Insert the URL (note: fixed the typo 'analytics_enabled,v' to 'analytics_enabled')
            INSERT INTO url (
                alias, 
                domain, 
                original_url, 
                user_id, 
                analytics_enabled,
                description,
                click_count
            ) VALUES (
                generated_alias,
                p_domain,
                current_url,
                p_user_id,
                TRUE, -- Enable analytics for sample URLs
                current_desc,
                floor(random() * 100)::bigint -- Random click count 0-99
            );

            -- Return the created URL info
            created_alias := generated_alias;
            created_short_url := 'https://' || p_domain || '/' || generated_alias;
            created_original_url := current_url;
            
            RETURN NEXT;
        END LOOP;

        -- Log the operation
        RAISE NOTICE 'Created % sample URLs for user ID %', p_url_count, p_user_id;
    END;
    $$;
  `);

    pgm.sql(`
    CREATE OR REPLACE FUNCTION create_new_user_with_data(
        p_email VARCHAR(200),
        p_password CHAR(60),
        p_name VARCHAR(40),
        p_domain VARCHAR(100) DEFAULT 'mukhtasar.pro',
        p_url_count INTEGER DEFAULT 20,
        p_analytics_count INTEGER DEFAULT 50
    )
    RETURNS TABLE(
        user_id INTEGER,
        email VARCHAR(200),
        name VARCHAR(40)
    )
    LANGUAGE plpgsql
    AS $$
    DECLARE
        new_user_id INTEGER;
        url_record RECORD;
        analytics_count INTEGER := 0;
        created_urls TEXT := '';
        
        -- Sample data for analytics
        browser_names TEXT[] := ARRAY[
            'Chrome', 'Firefox', 'Safari', 'Edge', 'Opera', 'Brave'
        ];
        
        os_names TEXT[] := ARRAY[
            'Windows 10', 'Windows 11', 'macOS Monterey', 'macOS Ventura', 
            'Ubuntu 20.04', 'Ubuntu 22.04', 'iOS 16', 'Android 12', 'Android 13'
        ];
        
        device_types TEXT[] := ARRAY[
            'Desktop', 'Mobile', 'Tablet'
        ];
        
        sample_ips TEXT[] := ARRAY[
            '192.168.1.100', '10.0.0.50', '172.16.0.25', '203.0.113.42',
            '198.51.100.15', '192.0.2.33', '203.0.113.78', '198.51.100.99'
        ];
        
        referers TEXT[] := ARRAY[
            'https://google.com/search?q=url+shortener',
            'https://twitter.com/home',
            'https://facebook.com/feed',
            'https://linkedin.com/feed',
            'https://reddit.com/r/webdev',
            'https://github.com/trending',
            'https://stackoverflow.com/questions',
            'direct',
            '',
            'https://dev.to/latest'
        ];
        
        i INTEGER;
        j INTEGER;
        clicks_to_add INTEGER;
        random_browser TEXT;
        random_os TEXT;
        random_device TEXT;
        random_ip TEXT;
        random_referer TEXT;
        random_date TIMESTAMPTZ;
    BEGIN
        -- Create the user
        INSERT INTO users (email, password, name, verified)
        VALUES (p_email, p_password, p_name, TRUE)
        RETURNING id INTO new_user_id;
            
        -- Create sample URLs using the existing function
        FOR url_record IN 
            SELECT * FROM create_sample_urls_for_user(new_user_id, p_domain, p_url_count)
        LOOP
            created_urls := created_urls || url_record.created_short_url || E'\\n';
            
            -- Generate random analytics for this URL
            -- Get the URL ID for this alias
            SELECT id INTO i 
            FROM url 
            WHERE alias = url_record.created_alias AND domain = p_domain;
            
            -- Generate 1-10 random analytics entries per URL
            clicks_to_add := floor(random() * 10 + 1)::INTEGER;
            
            FOR j IN 1..clicks_to_add LOOP
                -- Generate random analytics data
                random_browser := browser_names[floor(random() * array_length(browser_names, 1) + 1)];
                random_os := os_names[floor(random() * array_length(os_names, 1) + 1)];
                random_device := device_types[floor(random() * array_length(device_types, 1) + 1)];
                random_ip := sample_ips[floor(random() * array_length(sample_ips, 1) + 1)];
                random_referer := referers[floor(random() * array_length(referers, 1) + 1)];
                
                -- Generate random date within last 30 days
                random_date := CURRENT_TIMESTAMP - (random() * INTERVAL '30 days');
                
                INSERT INTO url_analytics (
                    url_id,
                    ip_address,
                    clicked_at,
                    browser_name,
                    os_name,
                    device_type,
                    referer
                ) VALUES (
                    i,
                    random_ip,
                    random_date,
                    random_browser,
                    random_os,
                    random_device,
                    CASE WHEN random_referer = '' THEN NULL ELSE random_referer END
                );
                
                analytics_count := analytics_count + 1;
                
                -- Break if we've reached the desired analytics count
                IF analytics_count >= p_analytics_count THEN
                    EXIT;
                END IF;
            END LOOP;
            
            -- Break if we've reached the desired analytics count
            IF analytics_count >= p_analytics_count THEN
                EXIT;
            END IF;
        END LOOP;
        
        -- Return results
        user_id := new_user_id;
        email := p_email;
        name := p_name;
        
        RETURN NEXT;
    END;
    $$;
  `);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    // Drop functions
    pgm.dropFunction('create_new_user_with_data', [
        'varchar(200)',
        'char(60)',
        'varchar(40)',
        'varchar(100)',
        'integer',
        'integer'
    ], { ifExists: true });

    pgm.dropFunction('create_sample_urls_for_user', [
        'integer',
        'varchar(100)',
        'integer'
    ], { ifExists: true });

    // Drop sequence
    pgm.dropSequence('url_unique_id', { ifExists: true });

    // Drop tables in reverse order of creation (respecting foreign key dependencies)
    pgm.dropTable('domain', { ifExists: true });
    pgm.dropTable('url_analytics', { ifExists: true });
    pgm.dropTable('url', { ifExists: true });
    pgm.dropTable('api_token', { ifExists: true });
    pgm.dropTable('users', { ifExists: true });
};