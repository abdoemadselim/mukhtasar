import type { Request, Response, NextFunction } from "express"

import { UnAuthorizedException } from "#lib/error-handling/error-types.js"
import tokenRepository from "#features/token/data-access/token.repository.js"
import type { TokenPermission, TokenType, TokenWithUrlType } from "#features/token/types.js";
import { READ_URL_PERMISSION } from "#features/token/data-access/const.js";

export function authToken(requiredPermission: TokenPermission) {
    return async (req: Request, res: Response, next: NextFunction) => {
        // no token is provided at all (no authorization field is set or it's sent with an empty value)
        const header_token = validateAndExtractToken(req);

        // there is token attached to the authorization header, but the token doesn't exist in db
        const db_token = await validateTokenExistenceInDB(header_token)

        // there is a token passed and it exists in db, but it doesn't have access for this specific short url (it's another user's short urls)
        const { alias, domain } = req.params;
        validateTokenOwnership(db_token as TokenWithUrlType, { alias, domain })

        // The token requires more than read permission (e.g. create, update, delete), and it doesn't have this permission
        validateTokenPermission(db_token, requiredPermission);

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

async function validateTokenExistenceInDB(header_token: string): Promise<TokenType | TokenWithUrlType> {
    const db_token = await tokenRepository.getTokenWithUrl({ token: header_token });
    if (!db_token) {
        throw new UnAuthorizedException();
    }

    return db_token;
}

function validateTokenOwnership(token: TokenWithUrlType, params: { alias: string; domain: string }) {
    const { alias, domain } = params;
    if (token.alias !== alias || token.domain !== domain) {
        throw new UnAuthorizedException();
    }
}

function validateTokenPermission(token: TokenType, requiredPermission: TokenPermission) {
    if (requiredPermission !== READ_URL_PERMISSION) {
        if (token[READ_URL_PERMISSION] !== true) {
            throw new UnAuthorizedException();
        }
    }
}