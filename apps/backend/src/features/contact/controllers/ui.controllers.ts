import type { Response } from "express";
import { IRequest } from "#features/contact/types.js";
import * as contactService from "#features/contact/domain/contact.service.js";

import { NoException } from "#lib/error-handling/error-types.js";

export async function sendContactMessage(req: IRequest, res: Response) {
    const { name, email, message } = req.body;

    await contactService.sendContactMessage({
        name,
        email,
        message,
    });

    const response = {
        errors: [],
        code: NoException.NoErrorCode,
        errorCode: NoException.NoErrorCodeString,
        data: {}
    };

    res.json(response);
}