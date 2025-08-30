// apps/backend/src/features/analytics/api.ts
import type { Request, Response } from "express";
import { asyncStore } from "#root/main.js";

import * as analyticsService from "#features/analytics/domain/analytics.service.js";

import { NoException } from "#lib/error-handling/error-types.js";
import { log, LOG_TYPE } from "#lib/logger/logger.js";

export async function getUrlAnalytics(req: Request, res: Response) {
    const start = Date.now();

    // 1- prepare the data for the service
    const { alias } = req.body;
    const {
        startDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 days ago
        endDate = new Date().toISOString(),
    } = req.body;

    // 2- pass the prepared data to the service
    const analytics = await analyticsService.getUrlAnalytics({
        alias,
        startDate: startDate as string,
        endDate: endDate as string,
    });

    // 3- prepare the response
    const response = {
        data: analytics,
        errors: [],
        code: NoException.NoErrorCode,
        errorCode: NoException.NoErrorCodeString,
    };

    // TODO: Can't be abstracted?
    const durationMs = Date.now() - start;
    const store = asyncStore.getStore();

    log(LOG_TYPE.INFO, {
        message: "Get URL analytics",
        requestId: store?.requestId,
        method: req.method,
        path: req.originalUrl,
        status: 200,
        durationMs,
        tokenId: store?.tokenId
    });

    // 4- send the response
    res.json(response);
}

export async function getBrowserStats(req: Request, res: Response) {
    const start = Date.now();

    // 1- prepare the data for the service
    const { alias } = req.query as { alias: string };
    const {
        startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
        endDate = new Date().toISOString()
    } = req.query;

    // 2- pass the prepared data to the service
    const browserStats = await analyticsService.getBrowserStats({
        alias,
        startDate: startDate as string,
        endDate: endDate as string
    });

    // 3- prepare the response
    const response = {
        data: browserStats,
        errors: [],
        code: NoException.NoErrorCode,
        errorCode: NoException.NoErrorCodeString,
    };

    const durationMs = Date.now() - start;
    const store = asyncStore.getStore();

    log(LOG_TYPE.INFO, {
        message: "Get browser statistics",
        requestId: store?.requestId,
        method: req.method,
        path: req.originalUrl,
        status: 200,
        durationMs,
        tokenId: store?.tokenId
    });

    res.json(response);
}

export async function getDeviceStats(req: Request, res: Response) {
    const start = Date.now();

    const { alias } = req.query as { alias: string };
    const {
        startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        endDate = new Date().toISOString()
    } = req.query;

    const deviceStats = await analyticsService.getDeviceStats({
        alias,
        startDate: startDate as string,
        endDate: endDate as string
    });

    const response = {
        data: deviceStats,
        errors: [],
        code: NoException.NoErrorCode,
        errorCode: NoException.NoErrorCodeString,
    };

    const durationMs = Date.now() - start;
    const store = asyncStore.getStore();

    log(LOG_TYPE.INFO, {
        message: "Get device statistics",
        requestId: store?.requestId,
        method: req.method,
        path: req.originalUrl,
        status: 200,
        durationMs,
        tokenId: store?.tokenId
    });

    res.json(response);
}

export async function getClicksOverTime(req: Request, res: Response) {
    const start = Date.now();

    const { alias } = req.query as { alias: string };
    const {
        startDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
        endDate = new Date().toISOString(),
        groupBy = 'day' // day, hour, week, month
    } = req.query;

    const clicksOverTime = await analyticsService.getClicksOverTime({
        alias,
        startDate: startDate as string,
        endDate: endDate as string,
        groupBy: groupBy as string
    });

    const response = {
        data: clicksOverTime,
        errors: [],
        code: NoException.NoErrorCode,
        errorCode: NoException.NoErrorCodeString,
    };

    const durationMs = Date.now() - start;
    const store = asyncStore.getStore();

    log(LOG_TYPE.INFO, {
        message: "Get clicks over time",
        requestId: store?.requestId,
        method: req.method,
        path: req.originalUrl,
        status: 200,
        durationMs,
        tokenId: store?.tokenId
    });

    res.json(response);
}

export async function getGeographicStats(req: Request, res: Response) {
    const start = Date.now();

    const { alias } = req.query as { alias: string };
    const {
        startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        endDate = new Date().toISOString()
    } = req.query;

    const geographicStats = await analyticsService.getGeographicStats({
        alias,
        startDate: startDate as string,
        endDate: endDate as string
    });

    const response = {
        data: geographicStats,
        errors: [],
        code: NoException.NoErrorCode,
        errorCode: NoException.NoErrorCodeString,
    };

    const durationMs = Date.now() - start;
    const store = asyncStore.getStore();

    log(LOG_TYPE.INFO, {
        message: "Get geographic statistics",
        requestId: store?.requestId,
        method: req.method,
        path: req.originalUrl,
        status: 200,
        durationMs,
        tokenId: store?.tokenId
    });

    res.json(response);
}

export async function getRefererStats(req: Request, res: Response) {
    const start = Date.now();

    const { alias } = req.query as { alias: string };
    const {
        startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        endDate = new Date().toISOString(),
    } = req.query;

    const refererStats = await analyticsService.getRefererStats({
        alias,
        startDate: startDate as string,
        endDate: endDate as string,
    });

    const response = {
        data: refererStats,
        errors: [],
        code: NoException.NoErrorCode,
        errorCode: NoException.NoErrorCodeString,
    };

    const durationMs = Date.now() - start;
    const store = asyncStore.getStore();

    log(LOG_TYPE.INFO, {
        message: "Get referer statistics",
        requestId: store?.requestId,
        method: req.method,
        path: req.originalUrl,
        status: 200,
        durationMs,
        tokenId: store?.tokenId
    });

    res.json(response);
}

export async function getHourlyStats(req: Request, res: Response) {
    const start = Date.now();

    const { alias } = req.query as { alias: string };
    const {
        startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
        endDate = new Date().toISOString(),
        timezone = 'UTC'
    } = req.query;

    const hourlyStats = await analyticsService.getHourlyStats({
        alias,
        startDate: startDate as string,
        endDate: endDate as string,
    });

    const response = {
        data: hourlyStats,
        errors: [],
        code: NoException.NoErrorCode,
        errorCode: NoException.NoErrorCodeString,
    };

    const durationMs = Date.now() - start;
    const store = asyncStore.getStore();

    log(LOG_TYPE.INFO, {
        message: "Get hourly statistics",
        requestId: store?.requestId,
        method: req.method,
        path: req.originalUrl,
        status: 200,
        durationMs,
        tokenId: store?.tokenId
    });

    res.json(response);
}

export async function getAnalyticsOverview(req: Request, res: Response) {
    const start = Date.now();

    const { alias } = req.query as { alias: string };
    const {
        startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // (30 days ago)
        endDate = new Date().toISOString()
    } = req.query;

    const overview = await analyticsService.getAnalyticsOverview({
        alias,
        startDate: startDate as string,
        endDate: endDate as string
    });

    const response = {
        data: overview,
        errors: [],
        code: NoException.NoErrorCode,
        errorCode: NoException.NoErrorCodeString,
    };

    const durationMs = Date.now() - start;
    const store = asyncStore.getStore();

    log(LOG_TYPE.INFO, {
        message: "Get analytics overview",
        requestId: store?.requestId,
        method: req.method,
        path: req.originalUrl,
        status: 200,
        durationMs,
        tokenId: store?.tokenId
    });

    res.json(response);
}