import { Router } from "express"
import { login, register, verify } from "#features/auth/controllers/auth.controllers.js";
import { loginSchema, newUserSchema, userVerificationSchema } from "../domain/auth.schemas.js";
import validateRequest from "#root/lib/validation/validator-middleware.js";

const router = Router()

router.post("/login", validateRequest([loginSchema]), login)
router.get("/verify", validateRequest([userVerificationSchema]), verify)
router.post("/register", validateRequest([newUserSchema]), register)

export default router;