import type { Request, Response } from "express";
import { asyncStore } from "#root/main.js";

import * as urlService from "#features/url/domain/url.service.js";
import domainRepository from "#features/domain/data-access/domain-repository.js";
import urlRepository from "#features/url/data-access/url.repository.js";

import { NoException, ValidationException } from "#lib/error-handling/error-types.js";
import { log, LOG_TYPE } from "#lib/logger/logger.js";
import { client as redisClient } from "#lib/db/redis-connection.js"


// apps/backend/src/features/url/controllers/url.controllers.ts
// Add this updated createUrl function to replace the existing one

export async function createUrl(req: Request, res: Response) {
    const start = Date.now();

    // 1- prepare the data for the service
    const { original_url, alias, domain, description = "" } = req.body;

    // Get user info if available (from session-based auth, not token-based)
    const sessionId = req.cookies[process.env.AUTH_SESSION_NAME as string];
    let user = null;

    if (sessionId) {
        const session = await redisClient.get(`sessions:${sessionId}`);
        if (session) {
            user = JSON.parse(session);
        }
    }

    // 2- Domain authorization logic
    const originalDomain = process.env.ORIGINAL_DOMAIN as string;
    let resolvedDomain = domain || originalDomain;

    if (!user) {
        // Guest users can only use the original domain
        if (domain && domain !== originalDomain) {
            // TODO: do we have to pass the shape of errors everywhere
            // TODO: shouldn't it be handled internally in the Exception class
            throw new ValidationException({ domain: { message: "لا يمكنك استخدام هذا النطاق." } })
        }
        resolvedDomain = originalDomain;
    } else {
        // Authenticated users can use original domain or their own domains
        if (domain && domain !== originalDomain) {
            const userOwnsDomain = await domainRepository.checkUserOwnsDomain({ userId: user.id, domain });
            if (!userOwnsDomain) {
                throw new ValidationException({ domain: { message: "لا يمكنك استخدام هذا النطاق." } })
            }
        }
    }

    const newUrl = {
        original_url,
        alias,
        domain: resolvedDomain,
        description,
        user_id: user?.id || null // null for guest users
    };

    // 3- pass the prepared data to the service
    const url = await urlService.createUrl(newUrl);

    // 4- prepare the response
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
    const durationMs = Date.now() - start;
    const store = asyncStore.getStore()

    log(LOG_TYPE.INFO, {
        level: "info",
        message: "Create URL",
        requestId: store?.requestId,
        method: req.method,
        path: req.originalUrl,
        status: 201,
        durationMs,
        tokenId: store?.tokenId,
        userEmail: user?.email || "guest"
    })

    res.status(201).json(response)
}

export async function getAllUrls(req: Request, res: Response) {
    //1- prepare the data for the service
    const { id } = (req as any).user;

    //2- pass the data to the service
    const urls = await urlRepository.getUrlsByUserId(id);

    //3- prepare the response
    const response = {
        data: {
            urls
        },
        errors: [],
        code: NoException.NoErrorCode,
        errorCode: NoException.NoErrorCodeString,
    }

    res.json(response)
}

export async function getUrlsPage(req: Request, res: Response) {
    //1- prepare the data for the service
    const { id } = (req as any).user;
    const { page = 0, pageSize = 10 } = req.query;

    //2- pass the data to the service
    const { urls, total } = await urlService.getUrlsPage({ user_id: id, page: Number(page), page_size: Number(pageSize) })

    //3- prepare the response
    const response = {
        data: {
            urls,
            total
        },
        errors: [],
        code: NoException.NoErrorCode,
        errorCode: NoException.NoErrorCodeString
    }

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
        user_email: (req as any).user.email
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
        user_email: (req as any).user.email
    })

    // 4- send the response
    res.json(response)
}