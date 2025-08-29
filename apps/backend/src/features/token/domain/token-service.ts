import { createHash, randomBytes } from "node:crypto";
import type { Request, Response, NextFunction } from "express"

import tokenRepository from "#features/token/data-access/token.repository.js"
import type { Token, TokenInput, TokenPermission, TokenWithUrlType } from "#features/token/types.js";
import { CREATE_URL_PERMISSION, READ_URL_PERMISSION } from "#features/token/data-access/const.js";

import { NotFoundException, UnAuthorizedException, ValidationException } from "#lib/error-handling/error-types.js"

// TODO: The service shouldn't depend on the request, response objects of express
export function authToken(requiredPermission: TokenPermission) {
    return async (req: Request, res: Response, next: NextFunction) => {
        // no token is provided at all (no authorization field is set or it's sent with an empty value)
        const header_token = validateAndExtractToken(req);

        // there is token attached to the authorization header, but the token doesn't exist in db
        const db_token = await validateTokenExistenceInDB(header_token, (req as any).params.alias || "", requiredPermission)

        // The token requires more than read permission (e.g. create, update, delete), and it doesn't have this permission
        validateTokenPermission(db_token, requiredPermission);

        if (requiredPermission == CREATE_URL_PERMISSION) {
            const domain = req.params.domain || req.body.domain;

            if (domain) {
                validateTokenOwnership(db_token as TokenWithUrlType, domain)
            }
        }

        (req as any).user_id = db_token?.user_id;

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



async function validateTokenExistenceInDB(header_token: string, alias: string, requiredPermission: TokenPermission): Promise<TokenWithUrlType> {
    // Hash the token (The token is shown to the user only once, while stored hashed in db)
    const token_hash = createHash("sha256").update(header_token).digest("hex");
    let db_token = null;

    // If it's a creation request, then there is no url.
    // Just needs to ensure there is a token in db matches the provided token from user
    if (requiredPermission == CREATE_URL_PERMISSION) {
        db_token = await tokenRepository.getTokenByTokenHash(token_hash);
    } else {
        db_token = await tokenRepository.getTokenWithUrl({ token_hash, alias });
    }

    if (!db_token) {
        throw new UnAuthorizedException();
    }

    return db_token;
}

function validateTokenOwnership(token: TokenWithUrlType, domain: string) {
    if (domain == process.env.ORIGINAL_DOMAIN) {
        return;
    }

    if (token.domain !== domain) {
        throw new ValidationException({ "domain": { message: "النطاق غير مسموح به. تحقق من النطاقات المضافة إلى حسابك." } });
    }
}

function validateTokenPermission(token: Token, requiredPermission: TokenPermission) {
    if (requiredPermission !== READ_URL_PERMISSION) {
        if (token[requiredPermission] !== true) {
            throw new UnAuthorizedException();
        }
    }
}

export async function generateToken({
    user_id,
    label,
    can_create,
    can_update,
    can_delete,
}: TokenInput) {
    // Generate token and hash it (why hashing? a layer of security in case the db leaks)
    const rawToken = randomBytes(32).toString("hex"); // 64 chars
    const tokenHash = createHash("sha256").update(rawToken).digest("hex");

    const token = await tokenRepository.createToken({
        tokenHash,
        can_create,
        can_update,
        can_delete,
        label,
        user_id,
    });

    // only return raw token once
    return {
        ...token,
        rawToken,
    }
}

export async function updateToken({
    tokenId,
    userId,
    updates
}: { tokenId: string, userId: string, updates: Partial<Omit<TokenInput, "userId">> }) {
    const token = await tokenRepository.getTokenById(tokenId);
    if (!token) throw new NotFoundException("This token doesn't exist");

    if (token.user_id !== userId) throw new UnAuthorizedException();

    const updated = await tokenRepository.updateToken({ tokenId, userId, updates });
    return updated;
}

export async function deleteToken({ userId, tokenId }: { userId: string, tokenId: string }) {
    const token = await tokenRepository.getTokenById(tokenId);
    if (!token) throw new NotFoundException("This token doesn't exist");

    if (token.user_id !== userId) throw new UnAuthorizedException();

    const deleted = await tokenRepository.deleteToken(tokenId);
    return deleted
}

export async function getTokensPage({ user_id, page, page_size }: { user_id: number, page: number, page_size: number }) {
    const { tokens, total } = await tokenRepository.getTokensPage({ user_id, page, page_size })
    return { tokens, total };
}