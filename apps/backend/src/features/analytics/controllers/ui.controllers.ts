// apps/backend/src/features/analytics/api.ts
import type { Request, Response } from "express";
import { UAParser } from "ua-parser-js";

import * as analyticsService from "#features/analytics/domain/analytics.service.js";

import { NoException, UnAuthorizedException } from "#lib/error-handling/error-types.js";
import { log, LOG_TYPE } from "#lib/logger/logger.js";

export async function getUrlAnalytics(req: Request, res: Response) {
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

    // 4- send the response
    res.json(response);
}

export async function getBrowserStats(req: Request, res: Response) {
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

    res.json(response);
}

export async function getDeviceStats(req: Request, res: Response) {
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

    res.json(response);
}

export async function getClicksOverTime(req: Request, res: Response) {
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

    res.json(response);
}

export async function getGeographicStats(req: Request, res: Response) {
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

    res.json(response);
}

export async function getRefererStats(req: Request, res: Response) {
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

    res.json(response);
}

export async function getHourlyStats(req: Request, res: Response) {
    const { alias } = req.query as { alias: string };
    const {
        startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
        endDate = new Date().toISOString(),
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

    res.json(response);
}

export async function getAnalyticsOverview(req: Request, res: Response) {
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

    res.json(response);
}


export async function createAnalyticsEvent(req: Request, res: Response) {
    validateAndExtractToken(req);

    const ip = req.ip;
    const referer = req.headers["referer"] || "Unknown";
    const userAgent = UAParser(req.headers["user-agent"])

    const analyticsEvent = {
        ip_address: ip || "Unknown",
        referer,
        browser_name: userAgent.browser.name || "Unknown",
        os_name: userAgent.os.name || "Unknown",
        device_type: userAgent.device.type || "Desktop",
    }

    const response = {
        data: analyticsEvent,
        errors: [],
        code: NoException.NoErrorCode,
        errorCode: NoException.NoErrorCodeString,
    };

    const alias = req.body.alias;

    // Errors happening here is out of request (won't be caught by the error handler, thus cause app crash)
    // Why not just awaiting? this would block the redirection 
    // TODO: create a redis queue, and a worker that consumes the jobs from the queue 
    analyticsService.updateAnalytics({ analyticsEvent, url_alias: alias })
        .catch((error) => {
            log(LOG_TYPE.ERROR, { message: "Analytics update failed", stack: error.stack });
        })


    // 4- send the response
    res.json(response);
}

function validateAndExtractToken(req: Request): string {
    const authHeader = req.headers.authorization;
    if (!authHeader) throw new UnAuthorizedException();

    const [scheme, token] = authHeader.split(" ");
    if (scheme !== "Bearer" || !token) {
        throw new UnAuthorizedException();
    }

    if (token !== process.env.WORKER_SECRET) {
        throw new UnAuthorizedException()
    }

    return token;
}

