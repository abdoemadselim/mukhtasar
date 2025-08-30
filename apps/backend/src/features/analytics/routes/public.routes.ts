// apps/backend/src/features/analytics/routes/api.routes.ts
import { Router } from "express";

import {
    createAnalyticsEvent
} from "#features/analytics/controllers/public.controllers.js";

const router = Router();

// Get hourly statistics
router.post(
    "/",
    createAnalyticsEvent
);

export default router;