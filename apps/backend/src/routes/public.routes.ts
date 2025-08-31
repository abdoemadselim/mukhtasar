import { Router } from "express"

import urlRoutes from "#features/url/routes/public.routes.js"

const router = Router()

router.use("/", urlRoutes)
export default router;