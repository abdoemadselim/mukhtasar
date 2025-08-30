// apps/backend/src/features/analytics/routes/api.routes.ts
import { Router } from "express";
import {
    getUrlAnalytics,
    getBrowserStats,
    getDeviceStats,
    getClicksOverTime,
    getGeographicStats,
    getRefererStats,
    getHourlyStats,
    getAnalyticsOverview
} from "#features/analytics/controllers/api.controllers.js";

import { ipRateLimiter } from "#lib/rate-limiting/rate-limiters.js";
import { authToken } from "#root/features/token/domain/token-service";

const router = Router();

// Get comprehensive analytics for a URL
router.get(
    "/",
    authToken("can_read"),
    ipRateLimiter(1, 100),
    getUrlAnalytics
);

// Get analytics overview (summary stats)
router.get(
    "/overview",
    authToken("can_read"),
    ipRateLimiter(1, 100),
    getAnalyticsOverview
);

// Get browser statistics
router.get(
    "/browsers",
    authToken("can_read"),
    ipRateLimiter(1, 100),
    getBrowserStats
);

// Get device statistics
router.get(
    "/devices",
    authToken("can_read"),
    ipRateLimiter(1, 100),
    getDeviceStats
);

// Get clicks over time
router.get(
    "/clicks-over-time",
    authToken("can_read"),
    ipRateLimiter(1, 100),
    getClicksOverTime
);

// Get geographic statistics
router.get(
    "/geography",
    authToken("can_read"),
    ipRateLimiter(1, 100),
    getGeographicStats
);

// Get referer statistics
router.get(
    "/referers",
    authToken("can_read"),
    ipRateLimiter(1, 100),
    getRefererStats
);

// Get hourly statistics
router.get(
    "/hourly",
    authToken("can_read"),
    ipRateLimiter(1, 100),
    getHourlyStats
);

export default router;