import type { Request, Response } from "express";
import { UAParser } from "ua-parser-js";
import * as urlService from "#features/url/domain/url.service.js";
import { URLNotFoundException } from "#features/url/domain/error-types.js";
import * as analyticsService from "#features/analytics/domain/analytics.service.js";
import { NoException } from "#lib/error-handling/error-types.js";
import { log, LOG_TYPE } from "#lib/logger/logger.js";

export async function redirectToOriginalUrl(req: Request, res: Response) {
    const { alias, domain = process.env.ORIGINAL_DOMAIN as string } = req.params;

    let originalUrl: string;
    try {
        originalUrl = await urlService.getOriginalUrl({ domain, alias });
    } catch (error) {
        if (error instanceof URLNotFoundException) {
            const web = process.env.WEB_URL || "/";
            return res.redirect(302, `${web}/pages/error`);
        }
        throw error;
    }

    const userAgent = UAParser(req.headers["user-agent"]);
    analyticsService.updateAnalytics({
        alias,
        domain,
        analyticsEvent: {
            ip_address: req.ip || "Unknown",
            referer: req.headers.referer || "Unknown",
            browser_name: userAgent.browser.name || "Unknown",
            os_name: userAgent.os.name || "Unknown",
            device_type: userAgent.device.type || "Desktop",
        },
    }).catch((error: Error) => {
        log(LOG_TYPE.ERROR, { message: "Analytics update failed", stack: error.stack });
    });

    return res.redirect(302, originalUrl);
}

export async function getOriginalUrl(req: Request, res: Response) {
    // 1- prepare the data for the service
    const { alias, domain = process.env.ORIGINAL_DOMAIN as string } = req.params;

    // 2- pass the prepared data to the service
    const original_url = await urlService.getOriginalUrl({ domain, alias });

    // 3- prepare the response
    const response = {
        data: {
            url: original_url,
        },
        errors: [],
        code: NoException.NoErrorCode,
        errorCode: NoException.NoErrorCodeString,
    }

    // 3- redirect users (Why 302, so the request always goes through us, and browser doesn't cache the original URL with our shortened URL)
    res.json(response)
}
