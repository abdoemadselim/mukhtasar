import { type NextFunction, type Request, type Response,  Router } from "express"

import tokenRoutes from "#features/token/routes/ui.routes.js"
import authRoutes from "#features/auth/routes/ui.routes.js"

const router = Router()

function auth(req: Request, res: Response, next: NextFunction) {
    console.log(req.cookies)
    next()
}

router.use("/token", auth, tokenRoutes)
router.use("/auth", authRoutes)
export default router;