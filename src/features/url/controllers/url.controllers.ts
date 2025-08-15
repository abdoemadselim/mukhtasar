import { type Request, type Response } from "express"

import * as urlService from "#features/url/domain/url.service.js"
;
import { NoException } from "#lib/error-handling/error-types.js";
import { logger } from "#lib/logger/logger.js";
import { asyncStore } from "#root/main.js";

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
        code: NoException.NoErrorCode
    }

    // TODO: Can't be abstracted?
    const durationMs = Date.now() - start;
    const store = asyncStore.getStore()
    logger.info({
        message: "Get URL info",
        requestId: req.body.requestId,
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
    const newUrl = req.body;

    // 2- pass the prepared data to the service
    const url = await urlService.createUrl(newUrl);

    // 3- prepare the response
    const response = {
        data: {
            short_url: url.short_url,
            alias: url.alias,
            domain: url.domain,
            original_url: url.original_url,
            created_at: url.created_at
        },
        errors: [],
        code: NoException.NoErrorCode
    }

    // Logging logic
    // TODO: Can't be abstracted?
    const durationMs = Date.now() - start;
    const store = asyncStore.getStore()

    logger.info({
        message: "Create URL",
        requestId: req.body.requestId,
        method: req.method,
        path: req.originalUrl,
        status: 200,
        durationMs,
        tokenId: store?.tokenId
    })
    res.json(response)
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
        code: NoException.NoErrorCode
    }

    // TODO: Can't be abstracted?
    const durationMs = Date.now() - start;
    logger.info({
        message: "Delete URL",
        requestId: req.body.requestId,
        method: req.method,
        path: req.originalUrl,
        status: 200,
        durationMs,
        tokenId: req.body.tokenId
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
        code: NoException.NoErrorCode
    }

    // TODO: Can't be abstracted?
    const durationMs = Date.now() - start;
    const store = asyncStore.getStore()

    logger.info({
        message: "Update URL",
        requestId: req.body.requestId,
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
        code: NoException.NoErrorCode
    }

    // TODO: Can't be abstracted?
    const durationMs = Date.now() - start;
    const store = asyncStore.getStore()

    logger.info({
        message: "Get URL click count",
        requestId: req.body.requestId,
        method: req.method,
        path: req.originalUrl,
        status: 200,
        durationMs,
        tokenId: store?.tokenId
    })

    // 4- send the response
    res.json(response)
}