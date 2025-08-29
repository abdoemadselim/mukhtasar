import { Router } from "express"
import { login, logout, signup, verify, verifyUser } from "#root/features/auth/controllers/ui.controllers.js";
import { forgotPasswordSchema, loginSchema, newUserSchema, userVerificationSchema } from "#features/auth/domain/auth.schemas.js";

import validateRequest from "#lib/validation/validator-middleware.js";
import { ipRateLimiter } from "#lib/rate-limiting/rate-limiters.js";

const router = Router()

router.post("/login", ipRateLimiter(15, 10), validateRequest([loginSchema]), login)
router.post("/logout", logout)
router.get("/verify", ipRateLimiter(60, 15), validateRequest([userVerificationSchema]), verify)
router.post("/signup", ipRateLimiter(60, 5), validateRequest([newUserSchema]), signup)
router.get("/me", verifyUser)
// router.post("/forgot-password", validateRequest([forgotPasswordSchema]), forgetPassword)

export default router;  