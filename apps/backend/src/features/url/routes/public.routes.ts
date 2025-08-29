import { Router } from "express"
import { getOriginalUrl } from "#features/url/controllers/public.controllers.js";
import { trackUrl } from "#features/analytics/middlewares/track-url.js";

const router = Router();

// Returns the details of a shortened URL
router.get("/:alias", trackUrl, getOriginalUrl)

export default router;