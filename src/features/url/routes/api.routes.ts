import { Router } from "express"

import { authToken } from "#features/token/domain/token-service.js";
import { shortUrlSchema, paramsSchema, toUpdateUrlSchema } from "#features/url/domain/url-schemas.js";
import {
    CREATE_URL_PERMISSION,
    DELETE_URL_PERMISSION,
    READ_URL_PERMISSION,
    UPDATE_URL_PERMISSION
} from "#features/token/data-access/const.js";
import { createUrl, deleteUrl, getShortUrlInfo, getUrlClickCounts } from "#features/url/controllers/url.controllers.js"

import validateRequest from "#lib/validation/validator-middleware.js";
import { apiRateLimiter } from "#lib/rate-limiting/rate-limiters.js";

const router = Router();

// Returns the details of a shortened URL
router.get(
    "/:domain/:alias",
    authToken(READ_URL_PERMISSION),
    apiRateLimiter(1, 20),
    validateRequest([paramsSchema]),
    getShortUrlInfo
)

// Create a short URL
router.post("/",
    authToken(CREATE_URL_PERMISSION),
    apiRateLimiter(1, 50),
    validateRequest([shortUrlSchema]),
    createUrl
)

// Delete a short URL
router.delete("/:domain/:alias",
    validateRequest([paramsSchema]),
    authToken(DELETE_URL_PERMISSION),
    apiRateLimiter(1, 50),
    deleteUrl
)

// Change the long url (Update the attached destination)
router.patch("/:domain/:alias",
    validateRequest([paramsSchema, toUpdateUrlSchema]),
    authToken(UPDATE_URL_PERMISSION),
    apiRateLimiter(1, 50),
)


// Get the click count for a URL
router.get("/:domain/:alias/count",
    validateRequest([paramsSchema]),
    authToken(READ_URL_PERMISSION),
    apiRateLimiter(1, 50),
    getUrlClickCounts
)

export default router;