import type { Request, Response } from "express";
import * as urlService from "#features/url/domain/url.service.js";
import { NoException } from "#lib/error-handling/error-types.js";

export async function getOriginalUrl(req: Request, res: Response) {
    // 1- prepare the data for the service
    const { alias, domain = process.env.ORIGINAL_DOMAIN as string } = req.params;

    // 2- pass the prepared data to the service
    const original_url = await urlService.getOriginalUrl({ domain, alias });

    // 3- prepare the response
    const response = {
        data: {
            url: original_url,
        },
        errors: [],
        code: NoException.NoErrorCode,
        errorCode: NoException.NoErrorCodeString,
    }

    // 3- redirect users (Why 302, so the request always goes through us, and browser doesn't cache the original URL with our shortened URL)
    res.json(response)
}
