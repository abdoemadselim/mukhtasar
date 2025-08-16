import type { Request, Response } from "express";

import { NoException } from "#lib/error-handling/error-types.js";
import * as tokenService from "#features/token/domain/token-service.js"

export async function generateToken(req: Request, res: Response) {
    const tokenHash = await tokenService.generateToken();

    res.json({
        data: {
            token: tokenHash
        },
        errors: [],
        code: NoException.NoErrorCode
    })
}