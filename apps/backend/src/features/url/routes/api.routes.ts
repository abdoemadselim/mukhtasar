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
} from "#features/url/controllers/api.controllers.js"

import validateRequest from "#lib/validation/validator-middleware.js";

const router = Router();

// Returns the details of a shortened URL
router.get(
    "/:domain/:alias",
    authToken(READ_URL_PERMISSION),
    validateRequest([paramsSchema]),
    getShortUrlInfo
)

// Create a short URL
router.post("/",
    authToken(CREATE_URL_PERMISSION),
    validateRequest([shortUrlSchema]),
    createUrl
)

// Delete a short URL
router.delete("/:domain/:alias",
    authToken(DELETE_URL_PERMISSION),
    validateRequest([paramsSchema]),
    deleteUrl
)

// Change the long url (Update the attached destination)
router.patch("/:domain/:alias",
    authToken(UPDATE_URL_PERMISSION),
    validateRequest([paramsSchema, toUpdateUrlSchema]),
    updateUrl
)

// Get the click count for a URL
router.get("/:domain/:alias/count",
    authToken(READ_URL_PERMISSION),
    validateRequest([paramsSchema]),
    getUrlClickCounts
)
export default router;