import type { Request, Response } from "express";
import { asyncStore } from "#root/main.js";

import * as urlService from "#features/url/domain/url.service.js";

import { NoException } from "#lib/error-handling/error-types.js";
import { log, LOG_TYPE } from "#lib/logger/logger.js";

export async function getShortUrlInfo(req: Request, res: Response) {
    const start = Date.now();
    // 1- prepare the data for the service
    const { domain, alias } = req.params;

    // Why passing an object and not just arguments? so we don't pass them in the wrong order
    // as both are strings. (e.g. getUrl(alias, domain))
    // This way, we pass an object, so order doesn't matter anyway

    // 2- pass the prepared data to the service
    const url = await urlService.getUrlInfo({ alias, domain })

    // 3- prepare the response
    const response = {
        data: url,
        errors: [],
        code: NoException.NoErrorCode,
        errorCode: NoException.NoErrorCodeString,
    }

    // TODO: Can't be abstracted?
    const durationMs = Date.now() - start;
    const store = asyncStore.getStore()

    log(LOG_TYPE.INFO, {
        message: "Get URL info",
        requestId: store?.requestId,
        method: req.method,
        path: req.originalUrl,
        status: 200,
        durationMs,
        tokenId: store?.tokenId
    })

    // 4- send the response
    res.json(response)
}

export async function createUrl(req: Request, res: Response) {
    const start = Date.now();

    // 1- prepare the data for the service
    const newUrl =
    {
        ...req.body,
        user_id: (req as any).user_id
    }

    // 2- pass the prepared data to the service
    const url = await urlService.createUrl(newUrl);

    // 3- prepare the response
    const response = {
        data: {
            short_url: url.short_url,
            alias: url.alias,
            domain: url.domain,
            original_url: url.original_url,
            created_at: url.created_at,
            description: url.description
        },
        errors: [],
        code: NoException.NoErrorCode,
        errorCode: NoException.NoErrorCodeString,
    }

    // Logging logic
    // TODO: Can't be abstracted?
    const durationMs = Date.now() - start;
    const store = asyncStore.getStore()

    log(LOG_TYPE.INFO, {
        level: "info",
        message: "Create URL",
        requestId: store?.requestId,
        method: req.method,
        path: req.originalUrl,
        status: 200,
        durationMs,
        tokenId: store?.tokenId
    })

    res.status(201).json(response)
}

export async function deleteUrl(req: Request, res: Response) {
    const start = Date.now();

    // 1- prepare the data for the service
    const { domain, alias } = req.params;

    // 2- pass the prepared data to the service
    const url = await urlService.deleteUrl({ alias, domain })

    // 3- prepare the response
    const response = {
        data: url,
        errors: [],
        code: NoException.NoErrorCode,
        errorCode: NoException.NoErrorCodeString,
    }

    // TODO: Can't be abstracted?
    const durationMs = Date.now() - start;
    const store = asyncStore.getStore()

    log(LOG_TYPE.INFO, {
        message: "Delete URL",
        requestId: store?.requestId,
        method: req.method,
        path: req.originalUrl,
        status: 200,
        durationMs,
        tokenId: store?.tokenId
    })

    // 4- send the response
    res.json(response)
}

export async function updateUrl(req: Request, res: Response) {
    const start = Date.now();

    // 1- prepare the data for the service
    const { alias, domain } = req.params;
    const { original_url } = req.body;

    // 2- pass the prepared data to the service
    await urlService.updateUrl({ alias, domain }, original_url)

    // 3- prepare the response
    const response = {
        data: {
            url: original_url,
            alias,
            domain
        },
        errors: [],
        code: NoException.NoErrorCode,
        errorCode: NoException.NoErrorCodeString,
    }

    // TODO: Can't be abstracted?
    const durationMs = Date.now() - start;
    const store = asyncStore.getStore()

    log(LOG_TYPE.INFO, {
        message: "Update URL",
        requestId: store?.requestId,
        method: req.method,
        path: req.originalUrl,
        status: 200,
        durationMs,
        tokenId: store?.tokenId
    })

    // 4- send the response
    res.json(response)
}

export async function getUrlClickCounts(req: Request, res: Response) {
    const start = Date.now();

    // 1- prepare the data for the service
    const { alias, domain } = req.params;

    // 2- pass the prepared data to the service
    const clickCount = await urlService.getUrlClickCount({ alias, domain })

    // 3- prepare the response
    const response = {
        data: {
            alias,
            domain,
            clickCount
        },
        errors: [],
        code: NoException.NoErrorCode,
        errorCode: NoException.NoErrorCodeString,
    }

    // TODO: Can't be abstracted?
    const durationMs = Date.now() - start;
    const store = asyncStore.getStore()

    log(LOG_TYPE.INFO, {
        message: "Get URL click count",
        requestId: store?.requestId,
        method: req.method,
        path: req.originalUrl,
        status: 200,
        durationMs,
        tokenId: store?.tokenId
    })

    // 4- send the response
    res.json(response)
}

export async function getOriginalUrl(req: Request, res: Response) {
    // 1- prepare the data for the service
    const { alias } = req.params;

    // 2- pass the prepared data to the service
    const original_url = await urlService.getOriginalUrl(alias);

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
