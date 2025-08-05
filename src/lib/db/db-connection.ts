// Imports
import dotenv from "dotenv"
dotenv.config()
import { Pool } from 'pg'

/*
  database connection
*/
const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER_NAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE_NAME,
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
pool.on("error", (err) => {
    console.error('Unexpected error on idle PostgreSQL client:', err);
    
    // ADD LOGGING HERE
})

/*
    all queries go from here, so it's easy to log them
*/
export const query = (text: string, params?: []) => {
    // ADD LOGGING HERE
    
    return pool.query(text, params)
}