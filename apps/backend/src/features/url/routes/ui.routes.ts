import { Router } from "express"

// TODO: we heavily depend on the token feature here
import { shortUrlSchema } from "#features/url/domain/url-schemas.js";
import {
    createUrl,
    getUrlsPage
} from "#features/url/controllers/ui.controllers.js"
import { authSession } from "#features/auth/domain/auth.service.js";

import validateRequest from "#lib/validation/validator-middleware.js";
import { ipRateLimiter } from "#lib/rate-limiting/rate-limiters.js";

const router = Router();

// Create a short URL
router.post("/",
    ipRateLimiter(1, 50),
    validateRequest([shortUrlSchema]),
    createUrl
)

router.get(
    "/",
    ipRateLimiter(1, 40),
    authSession(),
    getUrlsPage
)

export default router;