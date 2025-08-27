import { Pool } from 'pg';

// Database connection configuration
const pool = new Pool({
  host: "localhost",
  user: "abdelrahman",
  password: "abdelrahman",
  database: "minimo_url",
  port: 5432,
});

// Function to generate a random IP address
function generateRandomIpAddress() {
  return `${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`;
}

// Function to generate a random browser name
function generateRandomBrowser() {
  const browsers = ['Chrome', 'Firefox', 'Safari', 'Edge', 'Opera', 'Brave'];
  return browsers[Math.floor(Math.random() * browsers.length)];
}

// Function to generate a random OS name
function generateRandomOs() {
  const oses = ['Windows', 'macOS', 'Linux', 'iOS', 'Android', 'Ubuntu'];
  return oses[Math.floor(Math.random() * oses.length)];
}

// Function to generate a random device type
function generateRandomDeviceType() {
  const devices = ['Desktop', 'Mobile', 'Tablet'];
  return devices[Math.floor(Math.random() * devices.length)];
}

// Function to generate a random referer URL
function generateRandomReferer() {
  const referers = [
    'https://www.google.com',
    'https://www.bing.com',
    'https://www.facebook.com',
    'https://www.twitter.com',
    'https://www.linkedin.com',
    null // 20% chance of no referer
  ];
  return referers[Math.floor(Math.random() * referers.length)];
}

// Function to generate a random timestamp within the last 30 days
function generateRandomTimestamp() {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
  const randomTime = new Date(thirtyDaysAgo.getTime() + Math.random() * (now.getTime() - thirtyDaysAgo.getTime()));
  return randomTime.toISOString();
}

// Function to insert analytics events in batches
async function insertAnalyticsEvents(totalEvents, batchSize) {
  try {
    console.log(`Generating ${totalEvents} analytics events for url_id = 1...`);

    for (let i = 0; i < totalEvents; i += batchSize) {
      const batch = [];
      const batchCount = Math.min(batchSize, totalEvents - i);
      console.log(`Preparing batch ${i / batchSize + 1} with ${batchCount} events`);

      // Generate batch of analytics events
      for (let j = 0; j < batchCount; j++) {
        batch.push({
          url_id: 1,
          ip_address: generateRandomIpAddress(),
          clicked_at: generateRandomTimestamp(),
          browser_name: generateRandomBrowser(),
          os_name: generateRandomOs(),
          device_type: generateRandomDeviceType(),
          referer: generateRandomReferer()
        });

        // Log sample data for the first few events (for testing purposes)
        if (i + j < 5) {
          console.log(`Sample event ${i + j + 1}:`, batch[j]);
        }
      }

      // Prepare query with parameterized values
      const values = batch.flatMap(item => [
        item.url_id,
        item.ip_address,
        item.clicked_at,
        item.browser_name,
        item.os_name,
        item.device_type,
        item.referer
      ]);

      const placeholders = batch.map((_, index) =>
        `($${index * 7 + 1}, $${index * 7 + 2}, $${index * 7 + 3}, $${index * 7 + 4}, $${index * 7 + 5}, $${index * 7 + 6}, $${index * 7 + 7})`
      ).join(',');

      const query = `
        INSERT INTO url_analytics (url_id, ip_address, clicked_at, browser_name, os_name, device_type, referer)
        VALUES ${placeholders}
      `;

      // Execute query
      const result = await pool.query(query, values);
      console.log(`Inserted batch ${i / batchSize + 1} (${result.rowCount} rows affected)`);
    }
    console.log('All analytics events inserted successfully');
  } catch (err) {
    console.error('Error inserting analytics events:', err);
  } finally {
    await pool.end();
  }
}

// Parameters
const TOTAL_EVENTS = 1000;
const BATCH_SIZE = 200;

// Run the insertion
insertAnalyticsEvents(TOTAL_EVENTS, BATCH_SIZE);