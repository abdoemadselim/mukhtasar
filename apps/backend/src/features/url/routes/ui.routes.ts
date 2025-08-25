import { Router } from "express"

// TODO: we heavily depend on the token feature here
import { authToken } from "#features/token/domain/token-service.js";
import { shortUrlSchema, paramsSchema, toUpdateUrlSchema } from "#features/url/domain/url-schemas.js";
import {
    CREATE_URL_PERMISSION,
    DELETE_URL_PERMISSION,
    READ_URL_PERMISSION,
    UPDATE_URL_PERMISSION
} from "#features/token/data-access/const.js";

import {
    createUrl,
    deleteUrl,
    getShortUrlInfo,
    getUrlClickCounts,
    updateUrl
} from "#features/url/controllers/url.controllers.js"

import validateRequest from "#lib/validation/validator-middleware.js";
import { apiRateLimiter } from "#lib/rate-limiting/rate-limiters.js";

const router = Router();

// Create a short URL
router.post("/",
    apiRateLimiter(1, 50),
    validateRequest([shortUrlSchema]),
    createUrl
)

export default router;