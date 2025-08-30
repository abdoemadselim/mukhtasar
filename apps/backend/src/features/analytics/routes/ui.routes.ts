// apps/backend/src/features/analytics/routes/api.routes.ts
import { Router } from "express";

import { paramsSchema } from "#features/url/domain/url-schemas.js";

import {
    getUrlAnalytics,
    getBrowserStats,
    getDeviceStats,
    getClicksOverTime,
    getGeographicStats,
    getRefererStats,
    getHourlyStats,
    getAnalyticsOverview
} from "#root/features/analytics/controllers/ui.controllers.js";

import { ipRateLimiter } from "#lib/rate-limiting/rate-limiters.js";

const router = Router();

// Get comprehensive analytics for a URL
router.get(
    "/",
    ipRateLimiter(1, 100),
    getUrlAnalytics
);

// Get analytics overview (summary stats)
router.get(
    "/overview",
    ipRateLimiter(1, 100),
    getAnalyticsOverview
);

// Get browser statistics
router.get(
    "/browsers",
    ipRateLimiter(1, 100),
    getBrowserStats
);

// Get device statistics
router.get(
    "/devices",
    ipRateLimiter(1, 100),
    getDeviceStats
);

// Get clicks over time
router.get(
    "/clicks-over-time",
    ipRateLimiter(1, 100),
    getClicksOverTime
);

// Get geographic statistics
router.get(
    "/geography",
    ipRateLimiter(1, 100),
    getGeographicStats
);

// Get referer statistics
router.get(
    "/referers",
    ipRateLimiter(1, 100),
    getRefererStats
);

// Get hourly statistics
router.get(
    "/hourly",
    ipRateLimiter(1, 100),
    getHourlyStats
);

export default router;