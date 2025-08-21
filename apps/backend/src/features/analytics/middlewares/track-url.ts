import type { Request, Response, NextFunction } from "express"
import { UAParser } from "ua-parser-js";

import * as analyticsService from "#features/analytics/domain/analytics.service.js"
import { log, LOG_TYPE } from "#lib/logger/logger.js";

// TODO: unknown? wouldn't be better to just set it the default value in DB
export const trackUrl = async (req: Request, res: Response, next: NextFunction) => {
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

    // Errors happening here is out of request (won't be caught by the error handler, thus cause app crash)
    // Why not just awaiting? this would block the redirection  
    // TODO: create a redis queue, and a worker that consumes the jobs from the queue 
    analyticsService.updateAnalytics({ analyticsEvent, url_alias: req.path.split("/")[1] })
        .catch((error) => {
            log(LOG_TYPE.ERROR, { message: "Analytics update failed", stack: error.stack });
        })

    next()
}