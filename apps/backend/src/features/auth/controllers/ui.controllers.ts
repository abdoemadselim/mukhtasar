import { randomUUID } from "node:crypto";
import type { Request, Response } from "express";

// TODO: a feature import from the main? (something's wrong here)

import type { NewUserType } from "@mukhtasar/shared";
import * as authService from "#features/auth/domain/auth.service.js"
import urlRepository from "#features/url/data-access/url.repository.js";
import { IRequest } from "#features/auth/types";

import { client as redisClient } from "#lib/db/redis-connection.js"
import { NoException, UnAuthorizedException } from "#lib/error-handling/error-types.js";
import { getSecureSessionConfig } from "#lib/session-handler/session-handler.js";

// ---------------------- LOGIN ----------------------
export async function login(req: IRequest, res: Response) {
    // Validate the data
    const { email, password } = req.body as { email: string, password: string };
    const user = await authService.login({ email, password })

    req.user = user;

    const sessionId = randomUUID()
    const sessionConfig = getSecureSessionConfig({
        key: process.env.AUTH_SESSION_NAME as string,
        value: sessionId,
        age: Number(process.env.SESSION_DURATION)
    });

    res.cookie(sessionConfig.key, sessionConfig.value, sessionConfig.options)

    redisClient.setEx(
        `sessions:${sessionId}`,
        Number(process.env.SESSION_DURATION) / 1000,
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

    res.json(response);
}

// ---------------------- REGISTER ----------------------
export async function signup(req: IRequest, res: Response) {
    const { email, password, name } = req.body as NewUserType;
    const user = await authService.createUser({ email, password, name })

    req.user = user

    const sessionId = randomUUID()

    const sessionConfig = getSecureSessionConfig({
        key: process.env.AUTH_SESSION_NAME as string,
        value: sessionId,
        age: Number(process.env.SESSION_DURATION)
    });

    res.cookie(sessionConfig.key, sessionConfig.value, sessionConfig.options)

    redisClient.setEx(
        `sessions:${sessionId}`,
        Number(process.env.SESSION_DURATION) / 1000,
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

    urlRepository.addSampleUrls(Number(user.id));

    res.status(201).json(response)
}

// ---------------------- VERIFY EMAIL ----------------------
export async function verify(req: Request, res: Response) {
    const { token } = req.query as { token: string };
    const sessionId = req.cookies[process.env.AUTH_SESSION_NAME as string];
    const session = await redisClient.get(`sessions:${sessionId}`)

    // User Email is already verified
    if (session) {
        const user = JSON.parse(session);
        if (user.verified) {
            res.redirect(process.env.WEB_URL as string)
        }
    }

    const user = await authService.verifyEmail({ token, sessionId })

    if (!user) {
        // Clear cookie on client
        const sessionConfig = getSecureSessionConfig({
            key: process.env.AUTH_SESSION_NAME as string
        })

        res.clearCookie(sessionConfig.key);
    }

    res.redirect(process.env.WEB_URL as string)
}

export async function logout(req: Request, res: Response) {
    const { sessionId } = req.cookies[process.env.AUTH_SESSION_NAME as string];
    if (sessionId) {
        redisClient.del(`sessions:${sessionId}`);
    }

    // Clear cookie on client
    const sessionConfig = getSecureSessionConfig({
        key: process.env.AUTH_SESSION_NAME as string
    })

    res.clearCookie(sessionConfig.key, sessionConfig.options);

    const response = {
        errors: [],
        data: {},
        code: NoException.NoErrorCode,
        errorCode: NoException.NoErrorCodeString,
    };

    return res.status(200).json(response);
}

export async function verifyUser(req: Request, res: Response) {
    const sessionId = req.cookies[process.env.AUTH_SESSION_NAME as string];

    if (!sessionId) {
        throw new UnAuthorizedException()
    }

    const session = await redisClient.get(`sessions:${sessionId}`)

    if (!session) {
        // Clear cookie on client
        const sessionConfig = getSecureSessionConfig({
            key: process.env.AUTH_SESSION_NAME as string
        })

        res.clearCookie(sessionConfig.key);
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

export async function sendResetPasswordMail(req: Request, res: Response) {
    const { email } = req.body as { email: string };

    await authService.sendResetPasswordMail(email);

    const response = {
        errors: [],
        code: NoException.NoErrorCode,
        errorCode: NoException.NoErrorCodeString,
        data: {}
    };

    res.json(response);
}

export async function resetPassword(req: Request, res: Response) {
    const { password, token } = req.body as { password: string, token: string };

    await authService.resetPassword({ password, token });

    const response = {
        errors: [],
        code: NoException.NoErrorCode,
        errorCode: NoException.NoErrorCodeString,
        data: {}
    };

    res.json(response);
}