import { Router } from "express"

import publicRoutes from "#features/url/routes/public.routes.js"

const router = Router()

router.use("/", publicRoutes)
export default router;