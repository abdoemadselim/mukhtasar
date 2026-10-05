import { createClient } from 'redis';
import { log, LOG_TYPE } from '#lib/logger/logger.js';

export const client = createClient({
    ...(process.env.REDIS_USER_NAME ? { username: process.env.REDIS_USER_NAME } : {}),
    ...(process.env.REDIS_PASSWORD ? { password: process.env.REDIS_PASSWORD } : {}),
    database: Number(process.env.REDIS_DB || 0),

    // TODO: This needs more investigation and thinking process later when load increases 
    RESP: 3,
    clientSideCache: {
        ttl: 86400,             // Time-to-live (0 = no expiration)
        maxEntries: 1000,      // Maximum entries (0 = unlimited)
        evictPolicy: "LRU"  // Eviction policy: "LRU" or "FIFO"
    },
    socket: {
        host: process.env.REDIS_HOST || "127.0.0.1",
        port: Number(process.env.REDIS_PORT || 6379)
    }
});

client.on('error', err => log(LOG_TYPE.ERROR, { message: 'Redis Client Error.', error: err }));
client.on('connect', () => log(LOG_TYPE.INFO, { message: 'Redis client connected successfully.' }));
client.on('disconnect', () => log(LOG_TYPE.WARN, { message: 'Redis client disconnected.' }));

export async function initRedis() {
    try {
        if (!client.isOpen) {
            await client.connect()
        }
    } catch (err) {
        log(LOG_TYPE.ERROR, {
            message: 'Failed to connect to Redis',
            error: err,
        });
    }
}

initRedis()