import { Router } from "express"

import tokenRoutes from "#features/token/routes/ui.routes.js"
import authRoutes from "#features/auth/routes/ui.routes.js"
import urlRoutes from "#features/url/routes/ui.routes.js"
import analyticsRoutes from "#features/analytics/routes/ui.routes.js"
import { authSession } from "#features/auth/domain/auth.service.js"

import { ipRateLimiter } from "#lib/rate-limiting/rate-limiters.js"

const router = Router()

router.use("/token", authSession(), tokenRoutes)
router.use("/auth", authRoutes)
router.use("/url", urlRoutes)
router.use("/analytics", authSession(), ipRateLimiter(1, 300), analyticsRoutes)

export default router;