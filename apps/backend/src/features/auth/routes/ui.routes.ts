import { Router } from "express"
import { login, logout, signup, verify, verifyUser, sendResetPasswordMail, resetPassword, authWithGoogle } from "#features/auth/controllers/ui.controllers.js";
import { loginSchema, newUserSchema, resetPasswordMailSchema, resetPasswordSchemaWithToken, userVerificationSchema } from "#features/auth/domain/auth.schemas.js";

import validateRequest from "#lib/validation/validator-middleware.js";
import { authRateLimiter } from "#lib/rate-limiting/rate-limiters.js";

const router = Router()

router.post("/login", authRateLimiter(15, 15), validateRequest([loginSchema]), login)
router.post("/logout", logout)
router.get("/verify", authRateLimiter(15, 15), validateRequest([userVerificationSchema]), verify)
router.post("/signup", authRateLimiter(15, 15), validateRequest([newUserSchema]), signup)
router.get("/google/callback", authRateLimiter(15, 15), authWithGoogle)
router.post("/password-reset-mail", authRateLimiter(15, 15), validateRequest([resetPasswordMailSchema]), sendResetPasswordMail)
router.post("/reset-password", authRateLimiter(15, 15), validateRequest([resetPasswordSchemaWithToken]), resetPassword)
router.get("/me", verifyUser)

export default router; 