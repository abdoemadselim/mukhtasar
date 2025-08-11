// Imports
import dotenv from "dotenv"
import express from "express";
import type { Request, Response, NextFunction } from 'express'
import bodyParser from "body-parser";

import apiRoutes from "#routes/api.routes.js"
import { HttpException, InternalServerException, NotFoundException, RateLimitingException, ValidationException } from "#lib/error-handling/error-types.js"
import { logger } from "#lib/logger/logger.js";
import { randomUUID } from "node:crypto"
import { AsyncLocalStorage } from 'node:async_hooks';

/**
 * App Configuration
 */
dotenv.config()
const app = express()
app.use(bodyParser.json())
export const asyncLocalStorage = new AsyncLocalStorage<{ requestId: string }>()

/**
 * App Routes
*/
// TODO: why adding to req.body and not req (makes sense more to add to the req object not req.body)
app.use((req, res, next) => {
    const requestId = randomUUID();
    const token = req.headers.authorization?.split(" ")[1];
    const tokenId = token ? `${token.slice(0, 6)}...` : undefined;
    req.body.tokenId = tokenId;

    asyncLocalStorage.run({ requestId }, next)
})
app.use("/api", apiRoutes)
app.use("/*splat", (req, res) => {
    throw new NotFoundException("Endpoint not found")
})

// TODO: becomes messy and needs refactoring now (e.g. abstract the logic away in a separate file)
/**
 * Error Handler Middleware
*/
app.use((err: Error | HttpException, req: Request, res: Response, next: NextFunction) => {
    // Common log metadata
    const logMeta = {
        requestId: req.body.requestId,
        method: req.method,
        path: req.originalUrl,
        tokenId: req.body.tokeId,
        stack: err.stack // <-- capture stack trace
    };

    // 1- Validation errors (alias too long, domain is invalid, etc.)
    if (err instanceof ValidationException) {
        logger.warn({
            ...logMeta,
            message: err.message,
            status: err.statusCode,
        })
        return res.status(err.statusCode).json({
            data: {},
            errors: err.validationErrors,
            code: err.responseCode
        })
    }

    // 2- Other errors such as notfoundUrl, etc.
    if (err instanceof HttpException) {
        logger.warn({
            ...logMeta,
            message: err.message,
            status: err.statusCode,
        })

        return res.status(err.statusCode).json({
            data: {},
            errors: [err.message],
            code: err.responseCode
        })
    }

    // 3- Any other unexpected thrown error 
    logger.error({
        ...logMeta,
        message: err.message,
        status: InternalServerException.STATUS_CODE,
    })
    return res.status(InternalServerException.STATUS_CODE).json({
        data: {},
        errors: [InternalServerException.MESSAGE],
        code: InternalServerException.RESPONSE_CODE
    })
})

process.on('SIGINT', () => {
    logger.info('Server is shutting down due to SIGINT (Ctrl+C)');
    process.exit(0);
});

process.on('SIGTERM', () => {
    logger.info('Server is shutting down due to SIGTERM');
    process.exit(0);
});

/**
 * Server activation
 */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => logger.info(`Server started at port ${PORT} in ${process.env.NODE_ENV} mode`))
