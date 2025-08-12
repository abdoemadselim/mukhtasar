import * as Sentry from "@sentry/node"

Sentry.init({
  dsn: "https://abcc672f231c8dff99ef2e134f1aa0fd@o4509831988117504.ingest.de.sentry.io/4509831995195472",
  tracesSampleRate: 1.0,
  enableLogs: true,
   integrations: [
    Sentry.consoleLoggingIntegration({ levels: ["log", "warn", "error"] }),
  ],
});
