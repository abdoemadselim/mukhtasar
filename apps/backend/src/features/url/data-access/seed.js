import {Pool} from 'pg';
import crypto from 'crypto';

// Database connection configuration
const pool = new Pool({
  host: "localhost",
  user: "abdelrahman",
  password: "abdelrahman",
  database: "minimo_url",
  port: 5432,
});

// Function to generate a random alias (6-12 characters)
function generateRandomAlias() {
  const length = Math.floor(Math.random() * 7) + 6; // Random length between 6 and 12
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let alias = '';
  for (let i = 0; i < length; i++) {
    alias += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return alias;
}

// Function to generate a random original URL
function generateRandomUrl() {
  const domains = ['example.com', 'testsite.org', 'webpage.net', 'sample.io', 'myapp.com'];
  const paths = ['/page', '/article', '/blog/post', '/product/item', '/user/profile', ''];
  const domain = domains[Math.floor(Math.random() * domains.length)];
  const path = paths[Math.floor(Math.random() * paths.length)];
  return `https://${domain}${path}/${crypto.randomBytes(4).toString('hex')}`;
}

// Function to insert URLs in batches
async function insertUrlsInBatches(totalUrls, batchSize, userId, domain) {
  try {
    for (let i = 0; i < totalUrls; i += batchSize) {
      const batch = [];
      const batchCount = Math.min(batchSize, totalUrls - i);
      console.log(`Preparing batch ${i / batchSize + 1} with ${batchCount} URLs`);

      // Generate batch of URLs
      for (let j = 0; j < batchCount; j++) {
        const alias = generateRandomAlias();
        const originalUrl = generateRandomUrl();
        batch.push({ alias, original_url: originalUrl });
      }

      // Prepare query with parameterized values
      const values = batch.flatMap(item => [item.alias, domain, item.original_url, userId]);
      const placeholders = batch.map((_, index) =>
        `($${index * 4 + 1}, $${index * 4 + 2}, $${index * 4 + 3}, $${index * 4 + 4})`
      ).join(',');

      const query = `
                INSERT INTO url (alias, domain, original_url, user_id)
                VALUES ${placeholders}
                ON CONFLICT (alias, domain) DO NOTHING
            `;

      // Execute query
      await pool.query(query, values);
      console.log(`Inserted batch ${i / batchSize + 1}`);
    }
    console.log('All URLs inserted successfully');
  } catch (err) {
    console.error('Error inserting URLs:', err);
  } finally {
    await pool.end();
  }
}

// Parameters
const TOTAL_URLS = 1000000;
const BATCH_SIZE = 1000;
const USER_ID = 1;
const DOMAIN = 'minimo.io';

// Run the insertion
insertUrlsInBatches(TOTAL_URLS, BATCH_SIZE, USER_ID, DOMAIN);