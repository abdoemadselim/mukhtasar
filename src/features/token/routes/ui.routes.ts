import { Router } from "express"

import { generateToken } from "#features/token/controllers/token.controllers.js";
import { tokenSchema } from "#features/token/data-access/token-schemas.js";

import validateRequest from "#lib/validation/validator-middleware.js";

const router = Router()

// Generate token
router.post(
    "/",
    validateRequest([tokenSchema]),
    generateToken
)

export default router;