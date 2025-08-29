import { Router } from "express"
import { getOriginalUrl, getShortUrlInfo } from "#features/url/controllers/api.controllers.js";
import { trackUrl } from "#features/analytics/middlewares/track-url.js";

const router = Router();

// Returns the details of a shortened URL
router.get("/:alias", trackUrl, getShortUrlInfo)

export default router;