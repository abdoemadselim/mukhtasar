import { Router } from "express"

// TODO: we heavily depend on the token feature here
import { paramsSchema, shortUrlSchema, toUpdateUrlSchema } from "#features/url/domain/url-schemas.js";
import {
    createUrl,
    deleteUrl,
    getUrlsPage,
    updateUrl
} from "#features/url/controllers/ui.controllers.js"
import { authSession } from "#features/auth/domain/auth.service.js";

import validateRequest from "#lib/validation/validator-middleware.js";
import { ipRateLimiter } from "#lib/rate-limiting/rate-limiters.js";

const router = Router();

// Create a short URL
router.post("/",
    ipRateLimiter(60, 100),
    validateRequest([shortUrlSchema]),
    createUrl
)

router.get(
    "/",
    ipRateLimiter(15, 300), // 300 requests per 15 minutes
    authSession(),
    getUrlsPage
)

router.delete(
    "/:domain/:alias",
    ipRateLimiter(60, 100), // 100 delete per hour
    validateRequest([paramsSchema]),
    authSession(),
    deleteUrl
)

// Change the long url (Update the attached destination)
router.patch("/:domain/:alias",
    ipRateLimiter(60, 100), // 100 updates per hour
    validateRequest([paramsSchema, toUpdateUrlSchema]),
    authSession(),
    updateUrl
)


export default router;