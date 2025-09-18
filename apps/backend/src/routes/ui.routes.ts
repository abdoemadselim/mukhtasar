import { Router } from "express"

import tokenRoutes from "#features/token/routes/ui.routes.js"
import authRoutes from "#features/auth/routes/ui.routes.js"
import urlRoutes from "#features/url/routes/ui.routes.js"
import analyticsRoutes from "#features/analytics/routes/ui.routes.js"
import domainRoutes from "#features/domain/routes/ui.routes.js"
import { authSession } from "#features/auth/domain/auth.service.js"

import { uiRateLimiter } from "#lib/rate-limiting/rate-limiters.js"

const router = Router()

router.use("/token", uiRateLimiter(15, 250), authSession(), tokenRoutes)
router.use("/auth", authRoutes)
router.use("/url", uiRateLimiter(15, 250), urlRoutes)
router.use("/analytics", uiRateLimiter(15, 250), analyticsRoutes)
router.use("/domain", uiRateLimiter(15, 250), domainRoutes)

export default router;