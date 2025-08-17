import { createHash, randomBytes } from "node:crypto";
import type { Request, Response, NextFunction } from "express"

import tokenRepository from "#features/token/data-access/token.repository.js"
import type { TokenPermission, TokenType, TokenWithUrlType } from "#features/token/types.js";
import { READ_URL_PERMISSION } from "#features/token/data-access/const.js";

import { UnAuthorizedException } from "#lib/error-handling/error-types.js"

// TODO: The service shouldn't depend on the request, response objects of express
export function authToken(requiredPermission: TokenPermission) {
    return async (req: Request, res: Response, next: NextFunction) => {
        // no token is provided at all (no authorization field is set or it's sent with an empty value)
        const header_token = validateAndExtractToken(req);

        // there is token attached to the authorization header, but the token doesn't exist in db
        const db_token = await validateTokenExistenceInDB(header_token)

        // The token requires more than read permission (e.g. create, update, delete), and it doesn't have this permission
        validateTokenPermission(db_token, requiredPermission);

        // there is a token passed and it exists in db, but it doesn't have access for this specific short url (it's another user's short urls)
        const { domain } = req.params || req.body;

        if (domain) {
            validateTokenOwnership(db_token as TokenWithUrlType, { domain })
        }

        req.body.user_id = db_token.user_id;

        // the token is totally valid and has required access
        next()
    }
}

function validateAndExtractToken(req: Request): string {
    const authHeader = req.headers.authorization;
    if (!authHeader) throw new UnAuthorizedException();

    const [scheme, token] = authHeader.split(" ");
    if (scheme !== "Bearer" || !token) {
        throw new UnAuthorizedException();
    }
    return token;
}

async function validateTokenExistenceInDB(header_token: string): Promise<TokenType> {
    const db_token = await tokenRepository.getTokenWithUrl({ token: header_token });
    if (!db_token) {
        throw new UnAuthorizedException();
    }

    return db_token;
}

function validateTokenOwnership(token: TokenWithUrlType, params: { domain: string }) {
    const { domain } = params;
    if (token.domain !== domain) {
        throw new UnAuthorizedException();
    }
}

function validateTokenPermission(token: TokenType, requiredPermission: TokenPermission) {
    if (requiredPermission !== READ_URL_PERMISSION) {
        if (token[requiredPermission] !== true) {
            throw new UnAuthorizedException();
        }
    }
}

export function generateToken() {
    // Generate token and hash it (why hashing? a layer of security in case the db leaks)
    const token = randomBytes(32).toString('hex')
    const tokenHash = createHash("sha256").update(token).digest('hex');

    // Store the token in db
    // tokenRepository.createToken({ tokenHash })

    return tokenHash
}