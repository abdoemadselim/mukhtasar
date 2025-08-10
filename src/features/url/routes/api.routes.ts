import { Router, type Request, type Response } from "express"

import { createUrl, getUrlInfo } from "#features/url/domain/url.service.js";
import { authToken } from "#features/token/domain/token-service.js";
import { createUrlBodySchema, paramsSchema, type ParamsType } from "#features/url/domain/url-schemas.js";
import { CREATE_URL_PERMISSION, READ_URL_PERMISSION } from "#features/token/data-access/const.js";
import type { UrlType } from "#features/url/types.js";

import validateRequest from "#lib/validation/validator-middleware.js";
import { NoException } from "#lib/error-handling/error-types.js";
import { apiRateLimiter } from "#lib/rate-limiting/rate-limiters.js";

const router = Router();

// Returns the details of a shortened URL
router.get(
    "/:domain/:alias",
    apiRateLimiter(1, 100),
    validateRequest([paramsSchema]),
    authToken(READ_URL_PERMISSION),
    async (req: Request<ParamsType>, res: Response) => {
        // 1- prepare the data for the service
        const { domain, alias } = req.params;

        // Why passing an object and not just arguments? so we don't pass them in the wrong order, as both are strings. (e.g. getUrl(alias, domain))
        // This way, we pass an object, so order doesn't matter anyway

        // 2- pass the prepared data to the service
        const url = await getUrlInfo({ alias, domain })

        // 3- prepare the response
        const response = {
            data: url,
            errors: [],
            code: NoException.NoErrorCode
        }

        // 4- send the response
        res.json(response)
    })

// Create a short URL
router.post("/",
    apiRateLimiter(1, 50),
    validateRequest([createUrlBodySchema]),
    authToken(CREATE_URL_PERMISSION),
    async (req: Request<any, any, Partial<UrlType>>, res: Response) => {
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

        res.json(response)
    })

export default router;