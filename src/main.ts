// Imports
import "#lib/logger/instrument.js" // Sentry Setup
import * as Sentry from "@sentry/node"
import compression from "compression"
import helmet from "helmet";

import { AsyncLocalStorage } from 'node:async_hooks';

import dotenv from "dotenv"
import express from "express";
import bodyParser from "body-parser";

import apiRoutes from "#routes/api.routes.js"
import uiRoutes from "#routes/ui.routes.js"

import { NotFoundException } from "#lib/error-handling/error-types.js"
import { logger } from "#lib/logger/logger.js";

import errorHandlerMiddleware from "#middlewares/error-handler.js";
import routesContext from "#middlewares/routes-context.js";

const app = express()

// ------ App Configuration -------------
dotenv.config()
app.use(compression());
app.use(helmet())
app.use(bodyParser.json())
export const asyncStore = new AsyncLocalStorage<{ requestId: string, tokenId: string }>()
app.use(routesContext)

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
