import { Router } from "express"
import { redirectToOriginalUrl } from "#features/url/controllers/redirect.controllers.js";

const router = Router();

// GET /r/:alias → 302 to the original URL (nginx maps https://<domain>/<alias> to this)
router.get("/:alias", redirectToOriginalUrl)

export default router;
