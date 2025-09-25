import type { Request, Response } from "express";

import * as urlService from "#features/url/domain/url.service.js";
import urlRepository from "#features/url/data-access/url.repository.js";
import { IRequest } from "#features/url/types.js";

import { NoException } from "#lib/error-handling/error-types.js";
import { client as redisClient } from "#lib/db/redis-connection.js"

export async function createUrl(req: Request, res: Response) {
    // 1- prepare the data for the service
    const { original_url, alias, domain, description = "" } = req.body;

    // 2- Get user info if available
    const sessionId = req.cookies[process.env.AUTH_SESSION_NAME as string];
    let user = null;

    if (sessionId) {
        const session = await redisClient.get(`sessions:${sessionId}`);
        if (session) {
            user = JSON.parse(session);
        }
    }

    // 3- Prepare data for the service
    const newUrl = {
        original_url,
        alias,
        domain,
        description,
        user_id: user?.id || null // null for guest users
    };

    // 4- pass the prepared data to the service
    const url = await urlService.createUrl(newUrl);

    // 5- prepare the response
    const response = {
        data: {
            short_url: url.short_url,
            alias: url.alias,
            domain: url.domain,
            original_url: url.original_url,
            created_at: url.created_at,
            description: url.description,
            is_temporary: url.is_temporary
        },
        errors: [],
        code: NoException.NoErrorCode,
        errorCode: NoException.NoErrorCodeString,
    }

    res.status(201).json(response)
}

export async function getAllUrls(req: IRequest, res: Response) {
    //1- prepare the data for the service
    const userId = req.user?.id;

    //2- pass the data to the service
    const urls = await urlRepository.getUrlsByUserId(userId as number);

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

export async function getUrlsPage(req: IRequest, res: Response) {
    //1- prepare the data for the service
    const userId = req.user?.id;
    const { page = 0, pageSize = 10 } = req.query;

    //2- pass the data to the service
    const { urls, total } = await urlService.getUrlsPage({ user_id: userId as number, page: Number(page), page_size: Number(pageSize) })

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

    // 4- send the response
    res.json(response)
}

export async function updateUrl(req: Request, res: Response) {
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

    // 4- send the response
    res.json(response)
}