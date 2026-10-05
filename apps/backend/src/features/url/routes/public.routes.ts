import { Router } from "express"
import { getOriginalUrl, redirectToOriginalUrl } from "#features/url/controllers/public.controllers.js";

const router = Router();

// Browser redirect used by the frontend (and nginx) when there is no Cloudflare worker in front.
router.get("/redirect/:domain/:alias", redirectToOriginalUrl)

// Returns the details of a shortened URL
router.get("/:domain/:alias", getOriginalUrl)

export default router;