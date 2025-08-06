import { Router } from "express"
import { query } from "#lib/db/db-connection.js"

const router = Router();

router.get("/", (req, res) => {
    query("SELECT * FROM api_token")
})

export default router;