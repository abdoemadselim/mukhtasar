import winston, { transports, format } from "winston"
import Transport from "winston-transport"
import * as Sentry from "@sentry/node"

// Uses the winston API to create a transport from Transport class to log to sentry
const SentryWinstonTransport = Sentry.createSentryWinstonTransport(Transport);

export const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: format.combine(
    format.timestamp(),
    format.json()
  ),
  exceptionHandlers: [
    new transports.Console({level: "error"}),
    new transports.File({ filename: 'exceptions.log' })
  ],
  transports: [
    new SentryWinstonTransport(),
    new transports.Console({level: "error"}),
    new transports.File({ filename: 'combined.log' }),
    new transports.File({ filename: 'errors.log', level: 'error' })
  ]
});
