import { rateLimit } from 'express-rate-limit'
import type { Request } from "express"

import { RateLimitingException, UnAuthorizedException } from '#lib/error-handling/error-types.js';

function getTokenFromHeader(req: Request) {
    const authHeader = req.headers.authorization;
    if (!authHeader) throw new UnAuthorizedException();

    const [scheme, token] = authHeader.split(" ");
    if (scheme !== "Bearer" || !token) {
        throw new UnAuthorizedException();
    }
    return token;
}

export function apiRateLimiter(windowInMin: number, limit: number) {
    return rateLimit({
        windowMs: windowInMin * 60 * 1000,
        limit: limit, // Limit each Token to 50 requests per `window` (here, per 15 minutes)
        standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
        legacyHeaders: false, // Disable the `X-RateLimit-*` headers
        keyGenerator: (req, res) => getTokenFromHeader(req),
        handler: () => { throw new RateLimitingException }
    })
}