// Imports
import dotenv from "dotenv"
import express from 'express'

dotenv.config()
const app = express()

app.get("/", (req, res) => {
    res.send("hello world")
})

/**
 * Server activation
 */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`server listening on PORT ${PORT}`))