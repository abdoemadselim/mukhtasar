import { Router } from "express"

import { deleteToken, generateToken, getTokensPage, updateToken } from "#features/token/controllers/ui.controllers.js";
import { tokenParams, tokenSchema, toUpdateTokenSchema } from "#features/token/data-access/token-schemas.js";

import validateRequest from "#lib/validation/validator-middleware.js";
import { ipRateLimiter } from "#lib/rate-limiting/rate-limiters";

const router = Router()

// Generate token
router.post(
    "/",
    ipRateLimiter(60, 20), // 20 token generations per hour
    validateRequest([tokenSchema]),
    generateToken
)

// Update token
router.patch(
    "/:tokenId",
    ipRateLimiter(60, 50),
    validateRequest([tokenParams, toUpdateTokenSchema]),
    updateToken
)

// Delete token
router.delete(
    "/:tokenId",
    ipRateLimiter(60, 50),
    validateRequest([tokenParams]),
    deleteToken
)

// Get tokens of a user
router.get(
    "/",
    ipRateLimiter(15, 200),
    getTokensPage
)

export default router;