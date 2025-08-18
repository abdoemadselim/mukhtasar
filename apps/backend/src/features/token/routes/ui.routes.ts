import { Router } from "express"

import { deleteToken, generateToken, getTokens, updateToken } from "#features/token/controllers/token.controllers.js";
import { tokenParams, tokenSchema, toUpdateTokenSchema } from "#features/token/data-access/token-schemas.js";

import validateRequest from "#lib/validation/validator-middleware.js";

const router = Router()

// Generate token
router.post(
    "/",
    validateRequest([tokenSchema]),
    generateToken
)

// Update token
router.patch(
    "/:tokenId",
    validateRequest([tokenParams, toUpdateTokenSchema]),
    updateToken
)

// Delete token
router.delete(
    "/:tokenId",
    validateRequest([tokenParams]),
    deleteToken
)

// Get tokens of a user
router.get(
    "/",
    getTokens
)

export default router;