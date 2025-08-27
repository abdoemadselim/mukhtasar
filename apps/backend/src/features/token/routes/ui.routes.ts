import { Router } from "express"

import { deleteToken, generateToken, getTokensPage, updateToken } from "#root/features/token/controllers/ui.controllers.js";
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
    getTokensPage
)

export default router;