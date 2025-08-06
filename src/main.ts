// Imports
import dotenv from "dotenv"
import express from 'express'
import apiRoutes from "./routes/api.routes.js"

dotenv.config()
const app = express()

app.use("/api", apiRoutes)

/**
 * Server activation
 */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`server listening on PORT ${PORT}`))
