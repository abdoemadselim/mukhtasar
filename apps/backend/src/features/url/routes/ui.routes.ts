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

const router = Router();

// Create a short URL
router.post("/",
    validateRequest([shortUrlSchema]),
    createUrl
)

// Get urls page (pagination)
router.get(
    "/",
    authSession(),
    getUrlsPage
)

// Delete url (It might remain in worker caching layer for around 5 minutes)
router.delete(
    "/:domain/:alias",
    validateRequest([paramsSchema]),
    authSession(),
    deleteUrl
)

// Change the long url (Update the attached destination)
router.patch("/:domain/:alias",
    validateRequest([paramsSchema, toUpdateUrlSchema]),
    authSession(),
    updateUrl
)

export default router;