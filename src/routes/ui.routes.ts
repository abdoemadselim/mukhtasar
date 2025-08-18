import { Router } from "express"

import tokenRoutes from "#features/token/routes/ui.routes.js"
import authRoutes from "#features/auth/routes/ui.routes.js"
import { authSession } from "#features/auth/domain/auth.service.js"

const router = Router()

router.use("/token", authSession(), tokenRoutes)
router.use("/auth", authRoutes)
export default router;