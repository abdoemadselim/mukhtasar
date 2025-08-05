// Imports
import dotenv from "dotenv"
dotenv.config()

import express from 'express'
const app = express()

app.get("/", async (req, res) => {
   
})

/**
 * Server activation
 */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`server listening on PORT ${PORT}`))
