import type { Response } from "express";

import * as tokenService from "#features/token/domain/token-service.js"
import { IRequest } from "#features/token/types";

import { NoException } from "#lib/error-handling/error-types.js";

export async function generateToken(req: IRequest, res: Response) {
    const { label, can_create, can_update, can_delete } = req.body;

    const user_id = req.user?.id;

    const token = await tokenService.generateToken({
        user_id: user_id as number,
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

    res.status(201).json(response);
}

export async function updateToken(req: IRequest, res: Response) {
    const { tokenId } = req.params;
    const { label, can_create, can_update, can_delete } = req.body;

    const userId = req.user?.id;

    const updatedToken = await tokenService.updateToken({ tokenId: Number(tokenId), userId: userId as number, updates: { label, can_create, can_delete, can_update } });

    const response = {
        data: { token: updatedToken },
        errors: [],
        code: NoException.NoErrorCode,
        errorCode: NoException.NoErrorCodeString,
    };

    res.json(response);
}

export async function deleteToken(req: IRequest, res: Response) {
    const { tokenId } = req.params;

    const userId = req.user?.id;

    const deletedToken = await tokenService.deleteToken({ tokenId: Number(tokenId), userId: userId as number });

    const response = {
        data: { token: deletedToken },
        errors: [],
        code: NoException.NoErrorCode,
        errorCode: NoException.NoErrorCodeString,
    };

    res.json(response);
}

export async function getTokensPage(req: IRequest, res: Response) {
    //1- prepare the data for the service
    const userId = req.user?.id;
    const { page = 0, pageSize = 10 } = req.query;

    //2- pass the data to the service
    const { tokens, total } = await tokenService.getTokensPage({ user_id: userId as number, page: Number(page), page_size: Number(pageSize) })

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

    res.json(response);
}

export async function regenerateToken(req: IRequest, res: Response) {
    const { tokenId } = req.params;
    const userId = req.user?.id;

    const regeneratedToken = await tokenService.regenerateToken({ tokenId: Number(tokenId), userId: userId as number });

    const response = {
        data: {
            token: regeneratedToken
        },
        errors: [],
        code: NoException.NoErrorCode,
        errorCode: NoException.NoErrorCodeString,
    };

    res.status(201).json(response);
}