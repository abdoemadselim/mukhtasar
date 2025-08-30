import { Router } from "express"
import { getOriginalUrl } from "#features/url/controllers/public.controllers.js";

const router = Router();

// Returns the details of a shortened URL
router.get("/:alias", getOriginalUrl)

export default router;