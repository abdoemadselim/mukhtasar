// Imports
// import 'newrelic';
import "dotenv/config"
import { AsyncLocalStorage } from 'node:async_hooks';
import "#lib/db/redis-connection.js";

import compression from "compression"
import helmet from "helmet";
import cors from "cors"

import express from "express";
import cookieParser from "cookie-parser"
import bodyParser from "body-parser";

import apiRoutes from "#routes/api.routes.js"
import uiRoutes from "#routes/ui.routes.js"
import publicRoutes from "#routes/public.routes.js"

import { NotFoundException } from "#lib/error-handling/error-types.js"
import { logger } from "#lib/logger/logger.js";

import errorHandlerMiddleware from "#middlewares/error-handler.js";
import routesContext from "#middlewares/routes-context.js";
const app = express()

const allowedOrigins = [
  "https://mukhtasar.pro",
  "https://www.mukhtasar.pro",
  "http://localhost:3002",
];

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
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);
// ------ App Configuration -------------
app.set("trust proxy", true);
app.use(compression());
app.use("/ui", helmet())
app.use(bodyParser.json())
app.use(routesContext)
app.use(cookieParser())
app.use(express.static("public"))
app.disable("x-powered-by")

export const asyncStore = new AsyncLocalStorage<{ requestId: string, tokenId: string }>()

// ------- App Routes -------------------
app.use("/api", apiRoutes)
app.use("/ui", uiRoutes)
app.use("/", publicRoutes)

// ------ Handling any other not existent routes (e.g. /not-existent-route) ------
app.use("*splash", (req, res, next) => {
  throw new NotFoundException("Endpoint not found.")
})

// ----- Error Handler Middleware ----------
app.use(errorHandlerMiddleware)

// ----- Server Activation -----------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  logger.info(`Server started at port ${PORT} in ${process.env.NODE_ENV} mode`)
)
