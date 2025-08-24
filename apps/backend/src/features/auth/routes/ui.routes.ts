import { Router } from "express"
import { login, logout, register, verify } from "#features/auth/controllers/auth.controllers.js";
import { forgotPasswordSchema, loginSchema, newUserSchema, userVerificationSchema } from "#features/auth/domain/auth.schemas.js";

import validateRequest from "#lib/validation/validator-middleware.js";

const router = Router()

router.post("/login", validateRequest([loginSchema]), login)
router.post("/logout", logout)
router.get("/verify", validateRequest([userVerificationSchema]), verify)
router.post("/register", validateRequest([newUserSchema]), register)
// router.post("/forgot-password", validateRequest([forgotPasswordSchema]), forgetPassword)

export default router;