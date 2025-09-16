import { createHash } from "node:crypto";
import { NextFunction, Response } from "express";
import bcrypt from "bcrypt"
import jwt, { JwtPayload } from "jsonwebtoken"

import type { NewUserType } from "@mukhtasar/shared";

// TODO: auth feature depends on user feature (Is this OK?)
import userRepository from "#features/user/data-access/user.repository.js";
import authRepository from "#features/auth/data-access/auth.repository.js";
import { LoginException, UnVerifiedException } from "#features/auth/domain/error-types.js";
import { IRequest } from "#features/auth/types";

import { ResourceExpiredException, UnAuthorizedException, ValidationException } from "#lib/error-handling/error-types.js";
import { sendVerificationMail } from "#lib/email/email.js";
import { client as redisClient } from "#lib/db/redis-connection.js"
import { log, LOG_TYPE } from "#lib/logger/logger.js";
import { getSecureSessionConfig } from "#lib/session-handler/session-handler.js";

// TODO: Can't we create a new type instead of omitting the password_confirmation everywhere?
export async function createUser({ email, password, name }: Omit<NewUserType, "password_confirmation">) {
    const isPwned = await isPasswordPwned(password)
    if (isPwned) {
        throw new ValidationException({
            password: {
                message: "هذه كلمة المرور ظهرت في تسريبات بيانات معروفة وقد تكون غير آمنة للاستخدام. يُرجى اختيار كلمة مرور مختلفة."
            }
        })
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds)
    if (!passwordHash) throw new Error()

    const existent_user = await userRepository.getUserByEmail(email)
    if (existent_user) {
        throw new ValidationException({ email: { message: "يوجد حساب مسجَّل مسبقًا بهذا البريد الإلكتروني." } })
    }

    const user = await authRepository.createUser({ name, email, password: passwordHash })

    const verificationToken = jwt.sign({
        userId: user.id,
        type: "email_verification",
    }, process.env.EMAIL_VERIFICATION_SECRET_KEY as string, { expiresIn: "24h" })

    // TODO: create a redis queue, and a worker that consumes the jobs from the queue 
    sendVerificationMail({ userEmail: user.email, userName: user.name, verificationToken })
        .catch((error) => {
            log(LOG_TYPE.ERROR, { message: "Verification Email sending failed", stack: error.stack });
        })

    return {
        name: user.name,
        email: user.email,
        verified: false,
        id: user.id
    };
}

// This function uses haveibeenpwned API to check if the password hash been in breached data
// Check API doc: https://haveibeenpwned.com/API/v3
async function isPasswordPwned(password: string): Promise<boolean> {
    // hash the password with sha1
    const hashAlgo = createHash("sha1");
    const password_hash = hashAlgo.update(password).digest("hex").toUpperCase()

    // the api takes only the 5 characters of the hash, so we don't have to send the whole password of the user!
    const password_prefix = password_hash.slice(0, 5);

    // the api returns the suffix of all the password hashes contains the 5 characters of the hash as a prefix + how many each hash appears in breached passwords
    const password_suffix = password_hash.slice(5);
    const res = await fetch(`https://api.pwnedpasswords.com/range/${password_prefix}`).then((res) => res.text())

    // returns true if at there's at least 1 breached password hash the same as the user password
    const isPwned = res.split("\n").some((hash) => {
        const [hashSuffix] = hash.trim().split(":");
        return hashSuffix === password_suffix;
    })

    return isPwned;
}

export async function verifyEmail({ token, sessionId }: { token: string, sessionId?: string }) {
    let decodedToken = null;
    try {
        decodedToken = jwt.verify(token, process.env.EMAIL_VERIFICATION_SECRET_KEY as string) as JwtPayload
        // TODO: how a user can asks for another verification link
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            throw new ResourceExpiredException("This verification link has expired.");
        }

        throw new Error();
    }

    const user = await userRepository.getUserById(decodedToken.userId)

    if (!user) {
        return;
    }

    await authRepository.setUserVerified(user.id);

    if (sessionId) {
        await redisClient.setEx(
            `sessions:${sessionId}`,
            Number(process.env.SESSION_DURATION) / 1000,
            JSON.stringify({
                id: user.id,
                name: user.name,
                email: user.email,
                verified: true
            }))
    }

    return user;
}

export async function login({ email, password }: { email: string, password: string }) {
    const user = await userRepository.getUserByEmail(email)

    if (!user) {
        throw new LoginException();
    }

    const isValid = await bcrypt.compare(password, user.password as string)
    if (!isValid) {
        throw new LoginException();
    }

    return {
        name: user.name,
        email: user.email,
        verified: user.verified,
        id: user.id
    }
}

// TODO: the service shouldn't depend on the req, res objects of express
export function authSession() {
    return async (req: IRequest, res: Response, next: NextFunction) => {
        const sessionId = req.cookies[process.env.AUTH_SESSION_NAME as string];

        // No cookie? Not authenticated
        if (!sessionId) {
            throw new UnAuthorizedException();
        }

        const session = await redisClient.get(`sessions:${sessionId}`);

        // No session in Redis (expired or invalidated)?
        if (!session) {
            // Clear cookie on client
            const sessionConfig = getSecureSessionConfig({
                key: process.env.AUTH_SESSION_NAME as string
            })

            res.clearCookie(sessionConfig.key);

            throw new UnAuthorizedException();
        }

        const user = JSON.parse(session);

        if (!user.verified) {
            throw new UnVerifiedException()
        }

        req.user = {
            name: user.name,
            email: user.email,
            verified: user.verified,
            id: user.id
        };

        next();
    }
}
