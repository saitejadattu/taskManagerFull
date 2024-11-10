const express = require("express")
const cors = require("cors")
const morgan = require("morgan")
const createError = require("http-errors")
const app = express()
app.use(express.json())
app.use(cors())
require("dotenv").config()
app.use(morgan("dev"))
const PORT = process.env.PORT || 3001
const connectToMongoDB = require("./dbConnection.js")
const Router = require("./connections.js")
app.use("/user", Router)
app.use(async (req,res, next)=>{
    // const error = new Error("Not found")
    // error.status = 404
    next(createError.NotFound())
})
app.use((err, req,res, next)=>{
    res.status(err.status || 500)
    res.send({
        status: err.status || 500,
        message: err.message
    })
})
connectToMongoDB()
app.listen(PORT, () => console.log("server running on http://localhost:"+String(PORT)))

