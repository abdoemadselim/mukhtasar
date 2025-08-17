import { randomUUID } from "node:crypto";
import type { Request, Response } from "express";

import type { NewUserType } from "#features/auth/domain/auth.schemas.js";
import * as authService from "#features/auth/domain/auth.service.js"

import { client as redisClient } from "#lib/db/redis-connection.js"
import { NoException } from "#lib/error-handling/error-types.js";
import { log, LOG_TYPE } from "#root/lib/logger/logger.js";
import { asyncStore } from "#root/main.js";

// ---------------------- LOGIN ----------------------
export async function login(req: Request, res: Response) {
    const start = Date.now();

    // Validate the data
    const { email, password } = req.body as { email: string, password: string };
    const user = await authService.login({ email, password })

    // @ts-ignore
    req.user = user;

    const SESSION_DURATION = 1000 * 60 * 60 * 2 * 24  // (2 days)
    const sessionId = randomUUID()
    res.cookie("muktasar-session", sessionId, {
        maxAge: SESSION_DURATION,
        httpOnly: true,
        secure: true,
        sameSite: "lax"
    });

    redisClient.setEx(
        `sessions:${sessionId}`,
        SESSION_DURATION / 1000,
        JSON.stringify({
            name: user.name,
            email: user.email,
            verified: user.verified
        }))

    const response = {
        errors: [],
        code: NoException.NoErrorCode,
        data: {
            user: {
                name: user.name,
                email: user.email,
                verified: user.verified
            }
        }
    };

    const durationMs = Date.now() - start;
    const store = asyncStore.getStore();

    log(LOG_TYPE.INFO, {
        message: "User login",
        requestId: req.body.requestId,
        method: req.method,
        path: req.originalUrl,
        status: 200,
        durationMs,
        tokenId: store?.tokenId,
        userEmail: email // ✅ safe to log email (not password!)
    });

    res.json(response);
}

// ---------------------- REGISTER ----------------------
export async function register(req: Request, res: Response) {
    const start = Date.now();
    const { email, password, name } = req.body as NewUserType;
    const user = await authService.createUser({ email, password, name })

    // @ts-ignore
    req.user = user

    const sessionId = randomUUID()
    // httpOnly: so even if a malicious script managed to land on our server, it can't access the cookie
    // secure: so the session is only sent over HTTPS (anyway, the server runs only over HTTPS)
    // sameSite: lax (default value): to prevent CSRF attacks (attackers do something on behalf of users because the user's cookie is sent with the malicious request)
    const SESSION_DURATION = 1000 * 60 * 60 * 2 * 24  // (2 days)
    res.cookie("muktasar-session", sessionId, {
        maxAge: SESSION_DURATION,
        httpOnly: true,
        secure: true,
        sameSite: "lax"
    });

    redisClient.setEx(
        `sessions:${sessionId}`,
        SESSION_DURATION / 1000,
        JSON.stringify({
            name: user.name,
            email: user.email,
            verified: false
        })
    );

    const response = {
        errors: [],
        data: {
            user: {
                name: user.name,
                email: user.email,
                isVerified: false
            }
        },
        code: NoException.NoErrorCode
    };

    const durationMs = Date.now() - start;
    const store = asyncStore.getStore();

    log(LOG_TYPE.INFO, {
        message: "User registered",
        requestId: req.body.requestId,
        method: req.method,
        path: req.originalUrl,
        status: 201,
        durationMs,
        tokenId: store?.tokenId,
        userEmail: email
    });

    res.status(201).json(response)
}

// ---------------------- VERIFY EMAIL ----------------------
export async function verify(req: Request, res: Response) {
    const start = Date.now();

    const { token } = req.query as { token: string };
    const sessionId = req.cookies["muktasar-session"];
    const session = await redisClient.get(`sessions:${sessionId}`)

    // User Email is already verified
    if (session) {
        const user = JSON.parse(session);
        if (user.verified) {
            return res.json({
                errors: [],
                data: {
                    user
                }
            })
        }

        const durationMs = Date.now() - start;
        const store = asyncStore.getStore();

        log(LOG_TYPE.INFO, {
            message: "Email already verified",
            requestId: req.body.requestId,
            method: req.method,
            path: req.originalUrl,
            status: 200,
            durationMs,
            tokenId: store?.tokenId,
            userEmail: user.email
        });
    }

    const user = await authService.verifyEmail({ token, sessionId })

    const response = {
        errors: [],
        data: {
            user: {
                name: user?.name,
                email: user?.email,
                verified: true
            }
        }
    };

    const durationMs = Date.now() - start;
    const store = asyncStore.getStore();

    log(LOG_TYPE.INFO, {
        message: "Email verified",
        requestId: req.body.requestId,
        method: req.method,
        path: req.originalUrl,
        status: 200,
        durationMs,
        tokenId: store?.tokenId,
        userEmail: user?.email
    });

    res.json(response)
}

