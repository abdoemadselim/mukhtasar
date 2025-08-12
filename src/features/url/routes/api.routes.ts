import { Router, type Request, type Response } from "express"

import { createUrl, deleteUrl, getUrlClickCount, getUrlInfo, updateUrl } from "#features/url/domain/url.service.js";
import { authToken } from "#features/token/domain/token-service.js";
import { shortUrlSchema, paramsSchema, toUpdateUrlSchema } from "#features/url/domain/url-schemas.js";
import { CREATE_URL_PERMISSION, DELETE_URL_PERMISSION, READ_URL_PERMISSION, UPDATE_URL_PERMISSION } from "#features/token/data-access/const.js";

import validateRequest from "#lib/validation/validator-middleware.js";
import { NoException } from "#lib/error-handling/error-types.js";
import { apiRateLimiter } from "#lib/rate-limiting/rate-limiters.js";
import { logger } from "#lib/logger/logger.js";
import { asyncStore } from "#root/main.js";

const router = Router();

// Returns the details of a shortened URL
router.get(
    "/:domain/:alias",
    authToken(READ_URL_PERMISSION),
    apiRateLimiter(1, 2),
    validateRequest([paramsSchema]),
    async (req: Request, res: Response) => {
        const start = Date.now();
        // 1- prepare the data for the service
        const { domain, alias } = req.params;

        // Why passing an object and not just arguments? so we don't pass them in the wrong order
        // as both are strings. (e.g. getUrl(alias, domain))
        // This way, we pass an object, so order doesn't matter anyway

        // 2- pass the prepared data to the service
        const url = await getUrlInfo({ alias, domain })

        // 3- prepare the response
        const response = {
            data: url,
            errors: [],
            code: NoException.NoErrorCode
        }

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
    })

// Create a short URL
router.post("/",
    authToken(CREATE_URL_PERMISSION),
    apiRateLimiter(1, 50),
    validateRequest([shortUrlSchema]),
    async (req: Request, res: Response) => {
        const start = Date.now();

        // 1- prepare the data for the service
        const newUrl = req.body;

        // 2- pass the prepared data to the service
        const url = await createUrl(newUrl);

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
    })

router.delete("/:domain/:alias",
    validateRequest([paramsSchema]),
    authToken(DELETE_URL_PERMISSION),
    apiRateLimiter(1, 50),
    async (req: Request, res: Response) => {
        const start = Date.now();

        // 1- prepare the data for the service
        const { domain, alias } = req.params;

        // 2- pass the prepared data to the service
        const url = await deleteUrl({ alias, domain })

        // 3- prepare the response
        const response = {
            data: url,
            errors: [],
            code: NoException.NoErrorCode
        }

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
    })

// Change the long url (Update the attached destination)
router.patch("/:domain/:alias",
    validateRequest([paramsSchema, toUpdateUrlSchema]),
    authToken(UPDATE_URL_PERMISSION),
    apiRateLimiter(1, 50),
    async (req: Request, res: Response) => {
        const start = Date.now();

        // 1- prepare the data for the service
        const { alias, domain } = req.params;
        const { original_url } = req.body;

        // 2- pass the prepared data to the service
        await updateUrl({ alias, domain }, original_url)

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
    })


// Get the click count for a URL
router.get("/:domain/:alias/count",
    validateRequest([paramsSchema]),
    authToken(READ_URL_PERMISSION),
    apiRateLimiter(1, 50),
    async (req: Request, res: Response) => {
        const start = Date.now();

        // 1- prepare the data for the service
        const { alias, domain } = req.params;

        // 2- pass the prepared data to the service
        const clickCount = await getUrlClickCount({ alias, domain })
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
    })

export default router;