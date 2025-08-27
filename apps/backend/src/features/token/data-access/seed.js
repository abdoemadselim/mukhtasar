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

// Function to generate a random token (32 bytes = 64 hex characters)
function generateRandomToken() {
  return crypto.randomBytes(32).toString('hex');
}

// Function to hash a token using SHA-256
function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

// Function to generate a random label
function generateRandomLabel() {
  const prefixes = ['API', 'Production', 'Development', 'Test', 'Mobile', 'Web', 'Backend', 'Frontend'];
  const suffixes = ['Key', 'Token', 'Access', 'Client', 'Service', 'App', 'Integration', 'Bot'];
  const numbers = Math.floor(Math.random() * 100);
  
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
  
  return `${prefix} ${suffix} ${numbers}`;
}

// Function to generate random permissions
function generateRandomPermissions() {
  return {
    can_create: Math.random() > 0.3, // 70% chance
    can_update: Math.random() > 0.5, // 50% chance
    can_delete: Math.random() > 0.7  // 30% chance
  };
}

// Function to generate a random past timestamp for last_used (or null)
function generateLastUsedTimestamp() {
  // 30% chance of being null (never used)
  if (Math.random() > 0.7) {
    return null;
  }
  
  // Generate a timestamp within the last 30 days
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
  const randomTime = new Date(thirtyDaysAgo.getTime() + Math.random() * (now.getTime() - thirtyDaysAgo.getTime()));
  
  return randomTime.toISOString();
}

// Function to get all user IDs from the database
async function getUserIds() {
  try {
    const result = await pool.query('SELECT id FROM users ORDER BY id');
    return result.rows.map(row => row.id);
  } catch (err) {
    console.error('Error fetching user IDs:', err);
    return [];
  }
}

// Function to insert API tokens in batches
async function insertTokensInBatches(totalTokens, batchSize) {
  try {
    // Get all user IDs first
    const userIds = await getUserIds();
    if (userIds.length === 0) {
      console.error('No users found in database. Please seed users first.');
      return;
    }
    
    console.log(`Found ${userIds.length} users. Generating ${totalTokens} API tokens...`);
    
    for (let i = 0; i < totalTokens; i += batchSize) {
      const batch = [];
      const batchCount = Math.min(batchSize, totalTokens - i);
      console.log(`Preparing batch ${i / batchSize + 1} with ${batchCount} tokens`);

      // Generate batch of API tokens
      for (let j = 0; j < batchCount; j++) {
        const token = generateRandomToken();
        const tokenHash = hashToken(token);
        const label = generateRandomLabel();
        const userId = userIds[Math.floor(Math.random() * userIds.length)];
        const permissions = generateRandomPermissions();
        const lastUsed = generateLastUsedTimestamp();
        
        batch.push({ 
          user_id: userId,
          token_hash: tokenHash,
          label: label,
          last_used: lastUsed,
          can_create: permissions.can_create,
          can_update: permissions.can_update,
          can_delete: permissions.can_delete
        });
        
        // Log the actual token for the first few (for testing purposes)
        if (i + j < 5) {
          console.log(`Sample token ${i + j + 1}: ${token} (User ID: ${userId})`);
        }
      }

      // Prepare query with parameterized values
      const values = batch.flatMap(item => [
        item.user_id,
        item.token_hash,
        item.label,
        item.last_used,
        item.can_create,
        item.can_update,
        item.can_delete
      ]);
      
      const placeholders = batch.map((_, index) =>
        `($${index * 7 + 1}, $${index * 7 + 2}, $${index * 7 + 3}, $${index * 7 + 4}, $${index * 7 + 5}, $${index * 7 + 6}, $${index * 7 + 7})`
      ).join(',');

      const query = `
                INSERT INTO api_token (user_id, token_hash, label, last_used, can_create, can_update, can_delete)
                VALUES ${placeholders}
                ON CONFLICT (token_hash) DO NOTHING
            `;

      // Execute query
      const result = await pool.query(query, values);
      console.log(`Inserted batch ${i / batchSize + 1} (${result.rowCount} rows affected)`);
    }
    console.log('All API tokens inserted successfully');
  } catch (err) {
    console.error('Error inserting API tokens:', err);
  } finally {
    await pool.end();
  }
}

// Parameters
const TOTAL_TOKENS = 50000;  // Adjust based on your needs
const BATCH_SIZE = 1000;

// Run the insertion
insertTokensInBatches(TOTAL_TOKENS, BATCH_SIZE);