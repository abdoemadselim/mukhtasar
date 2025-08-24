import { createHash } from "node:crypto";
import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt"
import jwt, { JwtPayload } from "jsonwebtoken"

// TODO: auth feature depends on user feature (Is this OK?)
import userRepository from "#features/user/data-access/user.repository.js";
import authRepository from "#features/auth/data-access/auth.repository.js";
import type { NewUserType } from "#features/auth/domain/auth.schemas.js";
import { LoginException, UnVerifiedException } from "#features/auth/domain/error-types.js";

import { ConflictException, NotFoundException, ResourceExpiredException, UnAuthorizedException, ValidationException } from "../../../lib/error-handling/error-types.js";
import { sendVerificationMail } from "#lib/email/email.js";
import { client as redisClient } from "#lib/db/redis-connection.js"
import { log, LOG_TYPE } from "#lib/logger/logger.js";

// TODO: Can't we create a new type instead of omitting the password_confirmation everywhere?
export async function createUser({ email, password, name }: Omit<NewUserType, "password_confirmation">) {
    const isPwned = await isPasswordPwned(password)
    if (isPwned) {
        throw new ValidationException({ password: ["This password has appeared in known data breaches and may be unsafe to use. Please choose a different password."] })
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds)
    if (!passwordHash) throw new Error()

    const existent_user = await userRepository.getUserByEmail(email)
    if (existent_user) {
        throw new ConflictException("An account with this email already exists.")
    }

    const user = await authRepository.createUser({ name, email, password: passwordHash })

    const verificationToken = jwt.sign({
        userId: user.id,
        type: "email_verification",
    }, process.env.EMAIL_VERIFICATION_SECRET_KEY as string, { expiresIn: "24h" })

    // TODO: create a redis queue, and a worker that consumes the jobs from the queue 
    sendVerificationMail({ userEmail: user.email, userName: user.name, token: verificationToken })
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
        const [hashSuffix, count] = hash.trim().split(":");
        return hashSuffix === password_suffix;
    })

    return isPwned;
}

export async function verifyEmail({ token, sessionId }: { token: string, sessionId?: string }) {
    let decodedToken = null;
    try {
        decodedToken = jwt.verify(token, process.env.EMAIL_VERIFICATION_SECRET_KEY as string) as JwtPayload
        // TODO: how a user can asks for another verification link
    } catch (error: any) {
        if (error.name === "TokenExpiredError") {
            throw new ResourceExpiredException("This verification link has expired.");
        }

        throw new Error();
    }

    const user = await userRepository.getUserById(decodedToken.userId)

    if (!user) {
        throw new NotFoundException("User not found for this verification link.");
    }

    if (user.verified) {
        return user
    }

    authRepository.setUserVerified(user.id);

    if (sessionId) {
        const SESSION_DURATION = 1000 * 60 * 60 * 2 * 24  // (2 days)
        redisClient.setEx(
            `sessions:${sessionId}`,
            SESSION_DURATION / 1000,
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
    return async (req: Request, res: Response, next: NextFunction) => {
        const sessionId = req.cookies["muktasar-session"];

        // No cookie? Not authenticated
        if (!sessionId) {
            throw new UnAuthorizedException();
        }

        const session = await redisClient.get(`sessions:${sessionId}`);

        // No session in Redis (expired or invalidated)?
        if (!session) {
            throw new UnAuthorizedException();
        }

        const user = JSON.parse(session);

        if (!user.verified) {
            throw new UnVerifiedException()
        }

        // @ts-ignore
        req.user = {
            name: user.name,
            email: user.email,
            verified: user.verified,
            id: user.id
        };

        next();
    }
}