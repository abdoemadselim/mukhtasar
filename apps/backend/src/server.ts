import express from "express";
import cookieParser from "cookie-parser"
import cors from "cors"
import helmet from "helmet";
import bodyParser from "body-parser";

import apiRoutes from "#routes/api.routes.js"
import uiRoutes from "#routes/ui.routes.js"
import publicRoutes from "#routes/public.routes.js"

import errorHandlerMiddleware from "#middlewares/error-handler.js";
import routesContext from "#middlewares/routes-context.js";
import { requestLogger } from '#middlewares/logger.js';

import { initGeoIp } from '#lib/geo/geoip.js';
import { NotFoundException } from "#lib/error-handling/error-types.js"

// These are the allowed origins (to avoid issues with CORS and cookies)
const allowedOrigins = [
    "https://mukhtasar.pro", // For Frontend
    "https://www.mukhtasar.pro", // For Frontend
    "https://api.mukhtasar.pro", // For swagger
    "http://localhost:3002",
];

function createServer() {
    const app = express()

    app.use(
        cors({
            origin: (origin, callback) => {
                // allow requests with no origin (like mobile apps, curl)
                if (!origin) return callback(null, true);

                if (allowedOrigins.includes(origin)) {
                    return callback(null, true);
                } else {
                    return callback(new Error("Not allowed by CORS"));
                }
            },
            credentials: true,
            methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
            allowedHeaders: ["Content-Type", "Authorization", "Cookie"]
        })
    );
    // ------ App Configuration -------------
    app.set("trust proxy", true);
    app.use("/ui", helmet())
    app.use(bodyParser.json())

    // Sets a correlated request Id for logging
    // & in case of api routes, it slices the token and sets it only the first few characters of it for security concerns (why setting it? for logging)
    app.use(routesContext)
    app.use(cookieParser())

    app.use(express.static("public"))

    // To read the maxmind geoip file (used for mapping the IP address of urls users to their countries)
    // For URL analytics feature
    initGeoIp();

    // To avoid fingerprint attacks somehow by preventing easy detecting the used technologies (express in this case), I unset it here
    // Express by default sets this x-powered-by: express header
    app.disable("x-powered-by")

    // Register the logger middleware to log a little info for each incoming request
    app.use(requestLogger)

    // ------- App Routes -------------------
    app.use("/api", apiRoutes)
    app.use("/ui", uiRoutes)
    app.use("/public", publicRoutes)

    // ------ Handling any other not existent routes (e.g. /not-existent-route) ------
    app.use("*splash", () => {
        throw new NotFoundException("طلب غير صحيح.")
    })

    // ----- Error Handler Middleware ----------
    app.use(errorHandlerMiddleware)

    return app;
}

export default createServer