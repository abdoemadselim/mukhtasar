import type { Request, Response } from "express";
import { UAParser } from "ua-parser-js";

import * as urlService from "#features/url/domain/url.service.js";
import * as analyticsService from "#features/analytics/domain/analytics.service.js";
import domainRepository from "#features/domain/data-access/domain-repository.js";
import { log, LOG_TYPE } from "#lib/logger/logger.js";

// Same rule the Cloudflare worker used before forwarding an alias to the backend.
const ALIAS_PATTERN = /^[a-zA-Z0-9][a-zA-Z0-9_-]*[a-zA-Z0-9]$|^[a-zA-Z0-9]$/;

/*
 Server-side redirection (used when the site runs behind nginx instead of the Cloudflare worker):
 nginx sends https://<ORIGINAL_DOMAIN>/<alias> here as /r/<alias>.
 It resolves the alias (Redis first, then the DB), records the click like the worker did, then answers 302.
*/
export async function redirectToOriginalUrl(req: Request, res: Response) {
    const mainDomain = process.env.ORIGINAL_DOMAIN as string;
    const notFound = `${process.env.WEB_URL || `https://${mainDomain}`}/pages/not-found`;
    const alias = String(req.params.alias || "");

    // Cloudflare forwards a customer's own domain in this header; only trust it if it's an active custom domain
    const forwardedHost = String(req.headers["x-original-host"] || "").toLowerCase().trim();
    const domain = forwardedHost && forwardedHost !== mainDomain && await domainRepository.isActiveCustomDomain(forwardedHost)
        ? forwardedHost
        : mainDomain;

    if (alias.length > 30 || !ALIAS_PATTERN.test(alias)) {
        return res.redirect(302, notFound);
    }

    let originalUrl: string;
    try {
        originalUrl = await urlService.getOriginalUrl({ domain, alias });
    } catch {
        return res.redirect(302, notFound);
    }

    // Record the click without delaying the redirect (same fields as the worker's analytics call).
    const userAgent = UAParser(req.headers["user-agent"]);
    const analyticsEvent = {
        ip_address: req.ip || "Unknown",
        referer: req.headers["referer"] || "Unknown",
        browser_name: userAgent.browser.name || "Unknown",
        os_name: userAgent.os.name || "Unknown",
        device_type: userAgent.device.type || "Desktop",
    };
    analyticsService.updateAnalytics({ analyticsEvent, alias, domain })
        .catch((error) => log(LOG_TYPE.ERROR, { message: "Analytics update failed", stack: error.stack }));

    // 302 so every visit comes back through us (browsers don't cache it).
    res.set("Cache-Control", "no-store");
    return res.redirect(302, originalUrl);
}
