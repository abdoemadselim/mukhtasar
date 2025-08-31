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

import validateRequest from "#lib/validation/validator-middleware.js";

const router = Router();

router.options("*splash", (req, res) => {
    res.setHeader("Access-Control-Max-Age", "100"); // cache preflight for 10 minutes
    res.sendStatus(204);
});

router.get("*splash", (req, res, next) => {
    res.setHeader('Access-Control-Max-Age', '86400'); // 24 hours
    next();
})

// Get comprehensive analytics for a URL
router.get(
    "/",
    validateRequest([analyticsOverviewQuerySchema]),
    getUrlAnalytics
);

// Get analytics overview (summary stats)
router.get(
    "/overview",
    validateRequest([analyticsOverviewQuerySchema]),
    getAnalyticsOverview
);

// Get browser statistics
router.get(
    "/browsers",
    validateRequest([browserStatsQuerySchema]),
    getBrowserStats
);

// Get device statistics
router.get(
    "/devices",
    validateRequest([deviceStatsQuerySchema]),
    getDeviceStats
);

// Get clicks over time
router.get(
    "/clicks-over-time",
    validateRequest([clicksOverTimeQuerySchema]),
    getClicksOverTime
);

// Get geographic statistics
router.get(
    "/geography",
    validateRequest([geographicStatsQuerySchema]),
    getGeographicStats
);

// Get referer statistics
router.get(
    "/referers",
    validateRequest([refererStatsQuerySchema]),
    getRefererStats
);

// Get hourly statistics
router.get(
    "/hourly",
    validateRequest([hourlyStatsQuerySchema]),
    getHourlyStats
);

export default router;