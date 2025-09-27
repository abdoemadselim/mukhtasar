import type { Request, Response } from "express";
import type { NewUserType } from "@mukhtasar/shared";

import * as authService from "#features/auth/domain/auth.service.js"
import urlRepository from "#features/url/data-access/url.repository.js";
import { IRequest } from "#features/auth/types";

import { client as redisClient } from "#lib/db/redis-connection.js"
import { NoException, UnAuthorizedException } from "#lib/error-handling/error-types.js";
import { getSecureSessionConfig } from "#lib/session-handler/session-handler.js";
import { log, LOG_TYPE } from "#lib/logger/logger.js";

// ---------------------- LOGIN ----------------------
export async function login(req: IRequest, res: Response) {
    // Validate the data
    const { email, password } = req.body as { email: string, password: string };
    const user = await authService.login({ email, password })

    req.user = user;
    await authService.createUserSession({ res, user })
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
    await authService.createUserSession({ res, user })

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
    //1- Prepare the data for service
    const { password, token } = req.body as { password: string, token: string };

    //2- Send the data to service
    await authService.resetPassword({ password, token });

    //3- Prepare the response
    const response = {
        errors: [],
        code: NoException.NoErrorCode,
        errorCode: NoException.NoErrorCodeString,
        data: {}
    };

    //4- Send the response
    res.json(response);
}

export async function authWithGoogle(req: Request, res: Response) {
    //1- Prepare the data for service and get the authorization code from redirect url
    const { code } = req.query as { code: string };

    try {
        //2- Send the data to service
        const user = await authService.authWithGoogle(code);

        //3- Create user session
        await authService.createUserSession({ res, user })


        res.redirect(process.env.ORIGINAL_URL as string)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        log(LOG_TYPE.ERROR, { message: error.message, stack: error.stack, code: code?.substring(0, 10) + '...' })
        return res.redirect(`${process.env.ORIGINAL_URL}/error` as string)
    }
}