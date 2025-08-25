import type { Request, Response } from "express";
import { asyncStore } from "#root/main.js";

import * as tokenService from "#features/token/domain/token-service.js"

import { NoException, UnAuthorizedException } from "#lib/error-handling/error-types.js";
import { log, LOG_TYPE } from "#lib/logger/logger.js";

export async function generateToken(req: Request, res: Response) {
    const start = Date.now();

    const { label, can_create, can_update, can_delete } = req.body;

    // @ts-ignore
    const user_id = req.user?.id;
    
    if (!user_id) {
        throw new UnAuthorizedException()
    }

    const token = await tokenService.generateToken({
        user_id,
        label,
        can_create,
        can_update,
        can_delete,
    });

    const response = {
        data: { token }, // only time you show raw token
        errors: [],
        code: NoException.NoErrorCode,
        errorCode: NoException.NoErrorCodeString,
    };

    const durationMs = Date.now() - start;
    const store = asyncStore.getStore();

    log(LOG_TYPE.INFO, {
        message: "Generate token",
        requestId: store?.requestId,
        method: req.method,
        path: req.originalUrl,
        status: 201,
        durationMs,
        tokenId: store?.tokenId
    });

    res.status(201).json(response);
}

export async function updateToken(req: Request, res: Response) {
    const start = Date.now();

    const { tokenId } = req.params;
    const { label, can_create, can_update, can_delete } = req.body;

    // @ts-ignore
    const userId = req.user?.id;
    if (!userId) throw new UnAuthorizedException();

    const updatedToken = await tokenService.updateToken({ tokenId, userId, updates: { label, can_create, can_delete, can_update } });

    const response = {
        data: { token: updatedToken },
        errors: [],
        code: NoException.NoErrorCode,
        errorCode: NoException.NoErrorCodeString,
    };

    const durationMs = Date.now() - start;
    const store = asyncStore.getStore();


    log(LOG_TYPE.INFO, {
        message: "Update token",
        requestId: store?.requestId,
        method: req.method,
        path: req.originalUrl,
        status: 200,
        durationMs,
        tokenId: store?.tokenId
    });

    res.json(response);
}


export async function deleteToken(req: Request, res: Response) {
    const start = Date.now();

    const { tokenId } = req.params;

    // @ts-ignore
    const userId = req.user?.id;
    if (!userId) throw new UnAuthorizedException();

    const deletedToken = await tokenService.deleteToken({ tokenId, userId });

    const response = {
        data: { token: deletedToken },
        errors: [],
        code: NoException.NoErrorCode,
        errorCode: NoException.NoErrorCodeString,
    };

    const durationMs = Date.now() - start;
    const store = asyncStore.getStore();

    log(LOG_TYPE.INFO, {
        message: "Delete token",
        requestId: store?.requestId,
        method: req.method,
        path: req.originalUrl,
        status: 200,
        durationMs,
        tokenId: store?.tokenId
    });

    res.json(response);
}

export async function getTokens(req: Request, res: Response) {
    const start = Date.now();

    // @ts-ignore
    const userId = req.user?.id;
    if (!userId) throw new UnAuthorizedException();

    const tokens = await tokenService.getTokens(userId);

    const response = {
        data: { tokens },
        errors: [],
        code: NoException.NoErrorCode,
        errorCode: NoException.NoErrorCodeString,
    };

    const durationMs = Date.now() - start;
    const store = asyncStore.getStore();

    log(LOG_TYPE.INFO, {
        message: "Get tokens",
        requestId: store?.requestId,
        method: req.method,
        path: req.originalUrl,
        status: 200,
        durationMs,
        tokenId: store?.tokenId
    });

    res.json(response);
}