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
    getAnalyticsOverview,
} from "#features/analytics/controllers/ui.controllers.js";

import {
    analyticsOverviewQuerySchema,
    browserStatsQuerySchema,
    clicksOverTimeQuerySchema,
    deviceStatsQuerySchema,
    geographicStatsQuerySchema,
    hourlyStatsQuerySchema,
    refererStatsQuerySchema
} from "#features/analytics/domain/analytics-schemas.js";

import { ipRateLimiter } from "#lib/rate-limiting/rate-limiters.js";
import validateRequest from "#lib/validation/validator-middleware.js";

const router = Router();

// Get comprehensive analytics for a URL
router.get(
    "/",
    validateRequest([analyticsOverviewQuerySchema]),
    ipRateLimiter(1, 100),
    getUrlAnalytics
);

// Get analytics overview (summary stats)
router.get(
    "/overview",
    validateRequest([analyticsOverviewQuerySchema]),
    ipRateLimiter(1, 100),
    getAnalyticsOverview
);

// Get browser statistics
router.get(
    "/browsers",
    validateRequest([browserStatsQuerySchema]),
    ipRateLimiter(1, 100),
    getBrowserStats
);

// Get device statistics
router.get(
    "/devices",
    validateRequest([deviceStatsQuerySchema]),
    ipRateLimiter(1, 100),
    getDeviceStats
);

// Get clicks over time
router.get(
    "/clicks-over-time",
    validateRequest([clicksOverTimeQuerySchema]),
    ipRateLimiter(1, 100),
    getClicksOverTime
);

// Get geographic statistics
router.get(
    "/geography",
    validateRequest([geographicStatsQuerySchema]),
    ipRateLimiter(1, 100),
    getGeographicStats
);

// Get referer statistics
router.get(
    "/referers",
    validateRequest([refererStatsQuerySchema]),
    ipRateLimiter(1, 100),
    getRefererStats
);

// Get hourly statistics
router.get(
    "/hourly",
    validateRequest([hourlyStatsQuerySchema]),
    ipRateLimiter(1, 100),
    getHourlyStats
);

export default router;