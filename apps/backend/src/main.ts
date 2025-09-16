// Setup newrelic for monitoring
import 'newrelic';

// Setup dotenv for injecting env variables
import "dotenv/config"

// This is a wrapper around winston logger
import { log, LOG_TYPE } from "#lib/logger/logger.js";
import "#lib/db/redis-connection.js";

// This is a function that creates the express server and set it up with the routes, middlewares, etc.
// Why abstracted into a server?
// 1. Readability
// 2. For testing
import createServer from './server.js';

// ----- Server Activation -----------------
const app = createServer();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  log(LOG_TYPE.INFO, { message: `Server started at port ${PORT} in ${process.env.NODE_ENV} mode` })
)
