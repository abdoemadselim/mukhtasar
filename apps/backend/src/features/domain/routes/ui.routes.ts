import { Router } from "express"
import { getUserDomains } from "#features/domain/controllers/ui.controllers.js";
import { authSession } from "#features/auth/domain/auth.service.js";

const router = Router()

router.get("/", authSession(), getUserDomains)

export default router; 