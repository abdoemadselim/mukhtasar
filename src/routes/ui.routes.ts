import { Router } from "express"

import tokenRoutes from "#features/token/routes/ui.routes.js"

const router = Router()

router.use("/token", tokenRoutes)
export default router;