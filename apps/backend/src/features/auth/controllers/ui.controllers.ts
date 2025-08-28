import { randomUUID } from "node:crypto";
import type { Request, Response } from "express";

// TODO: a feature import from the main? (something's wrong here)
import { asyncStore } from "#root/main.js";

import type { NewUserType } from "@mukhtasar/shared";
import * as authService from "#features/auth/domain/auth.service.js"

import { client as redisClient } from "#lib/db/redis-connection.js"
import { NoException, UnAuthorizedException } from "#lib/error-handling/error-types.js";
import { log, LOG_TYPE } from "#lib/logger/logger.js";

// ---------------------- LOGIN ----------------------
export async function login(req: Request, res: Response) {
    const start = Date.now();

    // Validate the data
    const { email, password } = req.body as { email: string, password: string };
    const user = await authService.login({ email, password })

    // @ts-ignore
    req.user = user;

    const sessionId = randomUUID()
    const SESSION_DURATION = 1000 * 60 * 60 * 2 * 24  // (2 days)
    res.cookie("mukhtasar-session", sessionId, {
        maxAge: SESSION_DURATION,
        httpOnly: true,
        secure: true,
        sameSite: "lax"
    });

    console.log("hello world")
    redisClient.setEx(
        `sessions:${sessionId}`,
        SESSION_DURATION / 1000,
        JSON.stringify({
            id: user.id,
            name: user.name,
            email: user.email,
            verified: user.verified
        }))

    const response = {
        errors: [],
        code: NoException.NoErrorCode,
        errorCode: NoException.NoErrorCodeString,
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
        requestId: store?.requestId,
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
export async function signup(req: Request, res: Response) {
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
    res.cookie("mukhtasar-session", sessionId, {
        maxAge: SESSION_DURATION,
        httpOnly: true,
        secure: true,
        sameSite: "lax"
    });

    redisClient.setEx(
        `sessions:${sessionId}`,
        SESSION_DURATION,
        JSON.stringify({
            id: user.id,
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
        code: NoException.NoErrorCode,
        errorCode: NoException.NoErrorCodeString,
    };

    const durationMs = Date.now() - start;
    const store = asyncStore.getStore();

    log(LOG_TYPE.INFO, {
        message: "User registered",
        requestId: store?.requestId,
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
    const sessionId = req.cookies["mukhtasar-session"];
    const session = await redisClient.get(`sessions:${sessionId}`)

    // User Email is already verified
    if (session) {
        const user = JSON.parse(session);
        if (user.verified) {
            const durationMs = Date.now() - start;
            const store = asyncStore.getStore();

            log(LOG_TYPE.INFO, {
                message: "Email already verified",
                requestId: store?.requestId,
                method: req.method,
                path: req.originalUrl,
                status: 200,
                durationMs,
                tokenId: store?.tokenId,
                userEmail: user.email
            });

            res.redirect("http://localhost:3002/")
        }
    }

    const user = await authService.verifyEmail({ token, sessionId })

    const durationMs = Date.now() - start;
    const store = asyncStore.getStore();

    log(LOG_TYPE.INFO, {
        message: "Email verified",
        requestId: store?.requestId,
        method: req.method,
        path: req.originalUrl,
        status: 200,
        durationMs,
        tokenId: store?.tokenId,
        userEmail: user?.email
    });

    res.redirect("http://localhost:3002/")
}

export async function logout(req: Request, res: Response) {
    const { sessionId } = req.cookies["mukhtasar-session"];
    if (sessionId) {
        redisClient.del(`session:${sessionId}`);
    }

    // Clear cookie on client
    res.clearCookie("mukhtasar-session", {
        httpOnly: true,
        secure: true,
        sameSite: "lax"
    });

    const response = {
        errors: [],
        data: {},
        code: NoException.NoErrorCode,
        errorCode: NoException.NoErrorCodeString,
    };

    return res.status(200).json(response);
}

// // ---------------------- FORGOT PASSWORD ----------------------
// export async function forgotPassword(req: Request, res: Response) {
//     const start = Date.now();
//     const { email } = req.body as { email: string };

//     const user = await authService.findUserByEmail(email);
//     if (!user) {
//         const durationMs = Date.now() - start;
//         const store = asyncStore.getStore();

//         log(LOG_TYPE.INFO, {
//             message: "Forgot password attempt for non-existent user",
//             requestId: store?.requestId,
//             method: req.method,
//             path: req.originalUrl,
//             status: 200,
//             durationMs,
//             tokenId: store?.tokenId,
//             userEmail: email
//         });

//         // Return generic response to avoid leaking user existence
//         return res.json({
//             errors: [],
//             data: {
//                 message: "If the email exists, a password reset link will be sent"
//             }
//         });
//     }

//     const resetToken = randomUUID();
//     const RESET_TOKEN_DURATION = 1000 * 60 * 60; // 1 hour
//     await redisClient.setEx(
//         `reset:${resetToken}`,
//         RESET_TOKEN_DURATION / 1000,
//         JSON.stringify({
//             email: user.email,
//             userId: user.id
//         })
//     );

//     await authService.sendPasswordResetEmail(user.email, resetToken);

//     const response = {
//         errors: [],
//         data: {
//             message: "If the email exists, a password reset link will be sent",
//             resetToken // Included for testing; in production, this would be sent via email
//         }
//     };

//     const durationMs = Date.now() - start;
//     const store = asyncStore.getStore();

//     log(LOG_TYPE.INFO, {
//         message: "Password reset requested",
//         requestId: store?.requestId,
//         method: req.method,
//         path: req.originalUrl,
//         status: 200,
//         durationMs,
//         tokenId: store?.tokenId,
//         userEmail: email
//     });

//     res.json(response);
// }

export async function verifyUser(req: Request, res: Response) {
    const sessionId = req.cookies["mukhtasar-session"];

    if (!sessionId) {
        throw new UnAuthorizedException()
    }

    const session = await redisClient.get(`sessions:${sessionId}`)

    if (!session) {
        res.clearCookie("mukhtasar-session", {
            httpOnly: true,
            secure: true,
            sameSite: "lax"
        });

        throw new UnAuthorizedException()
    }

    const user = JSON.parse(session)
    const response = {
        errors: [],
        code: NoException.NoErrorCode,
        errorCode: NoException.NoErrorCodeString,
        data: {
            user: {
                name: user.name,
                email: user.email,
                verified: user.verified
            }
        }
    };

    res.json(response);
}