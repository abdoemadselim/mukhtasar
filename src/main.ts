// Imports
import "#lib/logger/instrument.js" // Sentry Setup
import "dotenv/config"
import "#lib/db/redis-connection.js";

import * as Sentry from "@sentry/node"
import compression from "compression"
import helmet from "helmet";

import { AsyncLocalStorage } from 'node:async_hooks';

import express from "express";
import cookieParser from "cookie-parser"
import bodyParser from "body-parser";

import apiRoutes from "#routes/api.routes.js"
import uiRoutes from "#routes/ui.routes.js"

import { NotFoundException } from "#lib/error-handling/error-types.js"
import { logger } from "#lib/logger/logger.js";

import errorHandlerMiddleware from "#middlewares/error-handler.js";
import routesContext from "#middlewares/routes-context.js";
const app = express()

// ------ App Configuration -------------
app.use(compression());
app.use(helmet())
app.use(bodyParser.json())
export const asyncStore = new AsyncLocalStorage<{ requestId: string, tokenId: string }>()
app.use(routesContext)
app.use(cookieParser())

// ------- App Routes -------------------
app.use("/api", apiRoutes)
app.use("/", uiRoutes)

// ------ Handling any other not existent routes (e.g. /not-existent-route) ------
app.use("/*splat", (req, res) => {
    throw new NotFoundException("Endpoint not found.")
})

Sentry.setupExpressErrorHandler(app)

// ----- Error Handler Middleware ----------
app.use(errorHandlerMiddleware)

// ----- Server Activation -----------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
    logger.info(`Server started at port ${PORT} in ${process.env.NODE_ENV} mode`)
)
