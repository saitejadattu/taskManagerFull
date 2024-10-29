const express = require("express")
const cors = require("cors")
const app = express()
app.use(express.json())
app.use(cors())
const connectToMongoDB = require("./dbConnection.js")
const Router = require("./connections.js")
app.use("/user", Router)
connectToMongoDB()
app.listen(3000, () => console.log("server running on http://localhost:3000"))

