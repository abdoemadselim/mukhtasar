import { Router } from "express"
import { login, logout, signup, verify, verifyUser } from "#features/auth/controllers/auth.controllers.js";
import { forgotPasswordSchema, loginSchema, newUserSchema, userVerificationSchema } from "#features/auth/domain/auth.schemas.js";

import validateRequest from "#lib/validation/validator-middleware.js";

const router = Router()

router.post("/login", validateRequest([loginSchema]), login)
router.post("/logout", logout)
router.get("/verify", validateRequest([userVerificationSchema]), verify)
router.post("/signup", validateRequest([newUserSchema]), signup)
router.get("/me", verifyUser)
// router.post("/forgot-password", validateRequest([forgotPasswordSchema]), forgetPassword)

export default router;  