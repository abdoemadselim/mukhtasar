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



export async function getTokensPage(req: Request, res: Response) {
    const start = Date.now();

    //1- prepare the data for the service
    const { id } = (req as any).user;
    const { page = 0, pageSize = 10 } = req.query;

    //2- pass the data to the service
    const { tokens, total } = await tokenService.getTokensPage({ user_id: id, page: Number(page), page_size: Number(pageSize) })

    //3- prepare the response
    const response = {
        data: {
            tokens,
            total
        },
        errors: [],
        code: NoException.NoErrorCode,
        errorCode: NoException.NoErrorCodeString
    }

    const durationMs = Date.now() - start;
    const store = asyncStore.getStore();

    log(LOG_TYPE.INFO, {
        message: "Get tokens page",
        requestId: store?.requestId,
        method: req.method,
        path: req.originalUrl,
        status: 200,
        durationMs,
        tokenId: store?.tokenId
    });

    res.json(response);
}