// Imports
import dotenv from "dotenv"
dotenv.config()
import { Pool, QueryArrayConfig, QueryConfigValues } from 'pg'
import { log, LOG_TYPE } from "#lib/logger/logger.js";
import { asyncStore } from "#root/main.js";

/*
  database connection
*/
export const pool = new Pool({
    // host: process.env.DB_HOST,
    // user: process.env.DB_USER_NAME,
    // password: process.env.DB_PASSWORD,
    // database: process.env.DB_DATABASE_NAME,
    connectionString: process.env.DB_CONNECTION_STRING,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
    min: 5
});

/*
 Even when clients are idle, they still might be connected to the db server.
 When clients can't reach the db server for some reason (e.g. db server restarts, or goes down)
 the client will throw an error, and node will cause the whole process to go down

 The client is idle in the background
 The DB goes down or the network breaks
 The PG client emits an event on the Node.js event loop, not during any Express request
*/
pool.on("error", (err) => log(LOG_TYPE.ERROR, { message: 'Unexpected error on idle PostgreSQL client', error: err }))

/*
    All queries go from here, so it's easy to log them
*/
export const query = async (queryData: string | QueryArrayConfig, params?: QueryConfigValues<string[]>) => {
    const start = Date.now();

    log(LOG_TYPE.DEBUG, {
        message: "Executing SQL query",
        query: queryData,
        params
    });

    let result;
    if (typeof queryData == "object") {
        result = await pool.query(queryData);
    } else if (typeof queryData == "string") {
        result = await pool.query(queryData, params)
    } else {
        throw new Error("Invalid query data type given to the query function")
    }

    const duration = Date.now() - start;
    const store = asyncStore.getStore()

    log(LOG_TYPE.INFO, {
        message: "SQL query executed successfully",
        query: queryData,
        durationMs: duration,
        rowCount: result.rowCount,
        requestId: store?.requestId
    });
    return result
}