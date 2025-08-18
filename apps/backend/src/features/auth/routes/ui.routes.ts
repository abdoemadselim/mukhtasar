import { Router } from "express"
import { login, register, verify } from "#features/auth/controllers/auth.controllers.js";
import { loginSchema, newUserSchema, userVerificationSchema } from "#features/auth/domain/auth.schemas.js";

import validateRequest from "#lib/validation/validator-middleware.js";
import { ipRateLimiter } from "#lib/rate-limiting/rate-limiters.js";

const router = Router()

router.post("/login", ipRateLimiter(1, 5), validateRequest([loginSchema]), login)
router.get("/verify", validateRequest([userVerificationSchema]), verify)
router.post("/register", validateRequest([newUserSchema]), register)

export default router;