import { ipKeyGenerator, rateLimit } from 'express-rate-limit'
import { RedisStore } from 'rate-limit-redis'

import { RateLimitingException } from '../error-handling/error-types.js';
import { asyncStore } from '#root/main.js';
import { client as redisClient } from '#lib/db/redis-connection.js';

function getToken(): string {
    const store = asyncStore.getStore()
    return store?.tokenId || "";
}

function rateLimitingConfig(windowInMin: number, limit: number) {
    return {
        windowMs: windowInMin * 60 * 1000,
        limit, // Limit each Token to 50 requests per `window` (here, per 15 minutes)
        standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
        legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    }
}

export function apiRateLimiter(windowInMin: number, limit: number) {
    return rateLimit({
        ...rateLimitingConfig(windowInMin, limit),
        keyGenerator: (req, res) => getToken(),
        handler: () => { throw new RateLimitingException },
        store: new RedisStore({
            sendCommand: (...args: string[]) => redisClient.sendCommand(args),
            prefix: "rl-api:"
        }),
    })
}

export function authRateLimiter(windowInMin: number, limit: number) {
    return rateLimit({
        ...rateLimitingConfig(windowInMin, limit),
        keyGenerator: (req, res) => ipKeyGenerator(req.ip as string),
        handler: () => { throw new RateLimitingException() },
        store: new RedisStore({
            sendCommand: (...args: string[]) => redisClient.sendCommand(args),
            prefix: "rl-auth:"
        }),
    });
}

export function uiRateLimiter(windowInMin: number, limit: number) {
    return rateLimit({
        ...rateLimitingConfig(windowInMin, limit),
        keyGenerator: (req, res) => ipKeyGenerator(req.ip as string),
        handler: () => { throw new RateLimitingException() },
        store: new RedisStore({
            sendCommand: (...args: string[]) => redisClient.sendCommand(args),
            prefix: "rl-ui:"
        }),
    });
}
