import { Router, type Request, type Response } from "express"

import { getUrl } from "#features/url/domain/url.service.js";
import { authToken } from "#features/token/domain/token-service.js";
import { createUrlBodySchema, paramsSchema, type ParamsType } from "#features/url/domain/url-schemas.js";
import { CREATE_URL_PERMISSION, READ_URL_PERMISSION } from "#features/token/data-access/const.js";

import validateRequest from "#lib/validation/validator-middleware.js";
import { NoException } from "#lib/error-handling/error-types.js";
import { apiRateLimiter } from "#lib/rate-limiting/rate-limiters.js";

const router = Router();

// Returns the details of a shortened URL
router.get(
    "/:domain/:alias",
    apiRateLimiter(1, 100),
    authToken(READ_URL_PERMISSION),
    validateRequest([paramsSchema]),
    async (req: Request<ParamsType>, res: Response) => {
        // 1- prepares the data for the service
        const { domain, alias } = req.params;

        // Why passing an object and not just arguments? so we don't pass them in the wrong order, as both are strings. (e.g. getUrl(alias, domain))
        // This way, we pass an object, so order doesn't matter anyway

        // 2- pass the prepared data to the service
        const url = await getUrl({ alias, domain })

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
    authToken(CREATE_URL_PERMISSION),
    validateRequest([createUrlBodySchema]),
    (req: Request, res: Response) => {

    })

export default router;