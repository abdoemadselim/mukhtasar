import winston, { transports, format } from "winston"

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
    new transports.Console({level: "error"}),
    new transports.File({ filename: 'combined.log' }),
    new transports.File({ filename: 'errors.log', level: 'error' })
  ]
});
