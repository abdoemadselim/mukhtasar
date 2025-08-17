import winston, { transports, format } from "winston"
import Transport from "winston-transport"
import * as Sentry from "@sentry/node"

export const LOG_TYPE = {
  ERROR: "error",
  WARN: "warn",
  INFO: "info",
  DEBUG: "debug"
}

// Uses the winston API to create a transport from Transport class to log to sentry
const SentryWinstonTransport = Sentry.createSentryWinstonTransport(Transport);

export const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: format.combine(
    format.timestamp(),
    format.json()
  ),
  exceptionHandlers: [
    new transports.Console({ level: "error" }),
    new transports.File({ filename: 'exceptions.log' })
  ],
  transports: [
    new SentryWinstonTransport(),
    new transports.Console({ level: "error" }),
    new transports.File({ filename: 'combined.log' }),
    new transports.File({ filename: 'errors.log', level: 'error' })
  ]
});


export function log<T extends { message: string }>(level: string, meta: T): void {
  logger.log({
    level,
    ...meta
  })
}