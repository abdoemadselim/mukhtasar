import { Router } from "express"

import urlRoutes from "#features/url/routes/api.routes.js"

const router = Router()

router.use("/url", urlRoutes)
export default router;