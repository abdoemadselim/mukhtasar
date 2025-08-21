import { Router } from "express"

import tokenRoutes from "#features/token/routes/ui.routes.js"
import authRoutes from "#features/auth/routes/ui.routes.js"
import { authSession } from "#features/auth/domain/auth.service.js"

import { ipRateLimiter } from "#lib/rate-limiting/rate-limiters.js"

const router = Router()

router.use("/token", authSession(), tokenRoutes)
router.use("/auth", ipRateLimiter(1, 10), authRoutes)
export default router;