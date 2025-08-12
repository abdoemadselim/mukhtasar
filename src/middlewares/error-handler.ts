import type { NextFunction, Request, Response } from "express";

import { HttpException, InternalServerException, ValidationException } from "#lib/error-handling/error-types.js";
import { logger } from "#lib/logger/logger.js";
import { asyncStore } from "#root/main.js";

const errorHandlerMiddleware = (err: Error | HttpException, req: Request, res: Response, next: NextFunction) => {
    const store = asyncStore.getStore();

    // Common log metadata
    const logMeta = {
        requestId: store?.requestId,
        method: req.method,
        path: req.originalUrl,
        tokenId: store?.tokenId,
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
};

export default errorHandlerMiddleware;