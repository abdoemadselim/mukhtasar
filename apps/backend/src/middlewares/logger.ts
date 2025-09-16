import type { NextFunction, Request, Response } from "express";
import { asyncStore } from "#middlewares/routes-context.js";
import { log, LOG_TYPE } from "#lib/logger/logger.js";

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();

    res.on("finish", () => {
        const durationMs = Date.now() - start;
        const store = asyncStore.getStore()

        log(LOG_TYPE.INFO, {
            message: "HTTP Request",
            requestId: store?.requestId,
            method: req.method,
            path: req.originalUrl,
            status: res.statusCode,
            durationMs,
            tokenId: store?.tokenId
        })
    })

    next()
}