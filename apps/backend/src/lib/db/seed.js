// seed.js
import dotenv from "dotenv"
dotenv.config();
import pkg from "pg";
import { faker } from "@faker-js/faker";
import bcrypt from "bcrypt";

console.log(process.env.DB_CONNECTION_STRING)
const { Pool } = pkg;
const pool = new Pool({
  connectionString: process.env.DB_CONNECTION_STRING,
  ssl: {
    rejectUnauthorized: false
  }
});

async function createTables() {
  await pool.query(`
    -- USERS
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
      email VARCHAR(200) UNIQUE NOT NULL,
      password CHAR(60) UNIQUE NOT NULL,
      name VARCHAR(40) NOT NULL,
      verified BOOLEAN DEFAULT FALSE
    );

    -- API TOKENS
    CREATE TABLE IF NOT EXISTS api_token (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      token_hash CHAR(64) UNIQUE NOT NULL,
      label VARCHAR(50) NOT NULL,
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
      last_used TIMESTAMPTZ,
      can_create BOOLEAN DEFAULT FALSE,
      can_update BOOLEAN DEFAULT FALSE,
      can_delete BOOLEAN DEFAULT FALSE
    );

    -- SHORT URL
    CREATE TABLE IF NOT EXISTS url (
      id SERIAL PRIMARY KEY,
      alias VARCHAR(20) NOT NULL,
      domain VARCHAR(100) NOT NULL,
      original_url VARCHAR(2000) CHECK (original_url ~* '^https?://'),
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      click_count BIGINT DEFAULT 0,
      analytics_enabled BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
      description VARCHAR(300),
      short_url VARCHAR(200) GENERATED ALWAYS AS ('http://' || domain || '/' || alias) STORED,
      UNIQUE(alias, domain)
    );

    ALTER TABLE url 
      ADD COLUMN IF NOT EXISTS url_hash BYTEA GENERATED ALWAYS AS (DECODE(MD5(original_url), 'hex')) STORED;

    CREATE INDEX IF NOT EXISTS unique_url_hash ON url USING HASH (url_hash);
    CREATE INDEX IF NOT EXISTS idx_url_user_id ON url(user_id);

    -- URL ANALYTICS
    CREATE TABLE IF NOT EXISTS url_analytics (
      id SERIAL PRIMARY KEY,
      url_id INTEGER REFERENCES url(id) ON DELETE CASCADE,
      ip_address VARCHAR(45),
      clicked_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
      browser_name VARCHAR(50),
      os_name VARCHAR(50),
      device_type VARCHAR(20),
      referer VARCHAR(2000)
    );

    -- DOMAIN
    CREATE TABLE IF NOT EXISTS domain (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      date_added TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
      domain_string VARCHAR(100) NOT NULL
    );
  `);
}

async function seedData() {
  // Create 5 users
  const userIds = [];
  for (let i = 0; i < 5; i++) {
    const email = faker.internet.email();
    const name = faker.person.firstName();
    const password = await bcrypt.hash("password123", 10);

    const res = await pool.query(
      `INSERT INTO users (email, password, name, verified) VALUES ($1, $2, $3, true) RETURNING id`,
      [email, password, name]
    );
    userIds.push(res.rows[0].id);
  }

  // Insert 20 API tokens
  for (let i = 0; i < 20; i++) {
    const userId = faker.helpers.arrayElement(userIds);
    const token = faker.string.alphanumeric(64);
    const label = `Token-${i + 1}`;

    await pool.query(
      `INSERT INTO api_token (user_id, token_hash, label, can_create, can_update, can_delete)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [userId, token, label, faker.datatype.boolean(), faker.datatype.boolean(), faker.datatype.boolean()]
    );
  }

  // Insert 1000 short URLs
  for (let i = 0; i < 1000; i++) {
    const userId = faker.helpers.arrayElement(userIds);
    const alias = faker.string.alphanumeric(8).toLowerCase();
    const domain = "mukhtasar.pro";
    const originalUrl = faker.internet.url();
    const description = faker.lorem.sentence();

    try {
      await pool.query(
        `INSERT INTO url (alias, domain, original_url, user_id, description, analytics_enabled)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [alias, domain, originalUrl, userId, description, faker.datatype.boolean()]
      );
    } catch (err) {
      if (err.code !== "23505") {
        console.error("Error inserting url:", err.message);
      }
    }
  }

  console.log("✅ Seeding complete!");
}

async function main() {
  try {
    await createTables();
    await seedData();
  } catch (err) {
    console.error("❌ Error:", err);
  } finally {
    await pool.end();
  }
}

main();
