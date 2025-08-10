// Imports
import dotenv from "dotenv"
import express from "express";
import type { Request, Response, NextFunction } from 'express'
import bodyParser from "body-parser";

import apiRoutes from "#routes/api.routes.js"
import { HttpException, InternalServerException, ValidationException } from "#lib/error-handling/error-types.js"

/**
 * App Configuration
 */
dotenv.config()
const app = express()
app.use(bodyParser.json())

/**
 * App Routes
*/
app.use("/api", apiRoutes)

/**
 * Error Handler Middleware
*/
app.use((err: Error | HttpException, req: Request, res: Response, next: NextFunction) => {
    // 1- Validation errors (alias too long, domain is invalid, etc.)
    if (err instanceof ValidationException) {
        return res.status(err.statusCode).json({
            data: {},
            errors: err.validationErrors,
            code: err.responseCode
        })
    }

    // 2- Other errors such as notfoundUrl, etc.
    if (err instanceof HttpException) {
        return res.status(err.statusCode).json({
            data: {},
            errors: [err.message],
            code: err.responseCode
        })
    }

    // 3- Any other thrown error
    console.error("Unhandled error:", err);
    return res.status(InternalServerException.STATUS_CODE).json({
        data: {},
        errors: [InternalServerException.MESSAGE],
        code: InternalServerException.RESPONSE_CODE
    })
})

/**
 * Server activation
 */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`server listening on PORT ${PORT}`))
