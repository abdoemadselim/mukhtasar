// apps/backend/src/features/analytics/api.ts
import type { Request, Response } from "express";
import { UAParser } from "ua-parser-js";

import * as analyticsService from "#features/analytics/domain/analytics.service.js";

import { NoException, UnAuthorizedException } from "#lib/error-handling/error-types.js";
import { log, LOG_TYPE } from "#lib/logger/logger.js";

export async function createAnalyticsEvent(req: Request, res: Response) {
    validateAndExtractToken(req);

    const ip = req.ip;
    const referer = req.headers["referer"] || "Unknown";
    let userAgent = UAParser(req.headers["user-agent"])

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

    // Errors happening here is out of request (won't be caught by the error handler, thus cause app crash)
    // Why not just awaiting? this would block the redirection 
    // TODO: create a redis queue, and a worker that consumes the jobs from the queue 
    analyticsService.updateAnalytics({ analyticsEvent, url_alias: req.path.split("/")[1] })
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

    return token;
}

