const express = require("express")
const User = require("./model.js")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const createError = require("http-errors")
const PASS_KEY = process.env.PASS_KEY
const Router = express.Router()
const authenticateToken = async (req, res, next) => {
    try {
        const token = req['headers'].authorization.split(" ")[1]
        if (!token) {
            res.send("Inavid token")
        }
        await jwt.verify(token, PASS_KEY, (error, payload) => {
            console.log(error)
            if (error) {
                if (error.name === "TokenExpiredError") {
                    res.status(403).json({
                        status: "failure",
                        message: "User Ticket has Expired"
                    })
                } else if (error.name === "JsonWebTokenError") {
                    res.status(402).json({
                        status: "failure",
                        message: "User Ticket has Invalid"
                    })
                }
                res.payload = payload
            }
            next()
        })
    } catch (error) {
        res.send(error.message)
    }
}
Router.get("/all", async (req, res, next) => {
    try {
        const getAllUsers = await User.find()
        res.send({
            "status": 200,
            "data": getAllUsers
        })
    } catch (error) {
        console.log(error.message)
    }
})
Router.post("/signup", async (req, res, next) => {
    try {
        const hashedPass = await bcrypt.hash(req.body.password, 10)
        const doesExists = await User.findOne({ "email": req.body.email })
        if (!doesExists) {
            const getAllUsers = await User({ ...req.body, password: hashedPass })
            const result = await getAllUsers.save()
            res.send({ "status": 200, "message": "User registerd successfully" })
        } else {
            res.send({
                "status": 403,
                "message": `${req.body.email} is already exists`
            })
        }
    } catch (error) {
        console.log(error.message)
    }
})
Router.post("/login", async (req, res, next) => {
    try {
        const findUser = await User.findOne({ email: req.body.email })
        if (findUser === null) {
            res.send({
                "status": 403,
                "message": "user not found please signup before login"
            })
        } else {
            // console.log({ "id": findUser._id })
            const jwtToken = jwt.sign({ "id": findUser._id }, PASS_KEY)
            const isValidUser = await bcrypt.compare(req.body.password, findUser.password)
            if (isValidUser) {
                res.send({
                    "status": 200,
                    "jwt": jwtToken,
                    "message": "User login successfully!"
                })
            } else {
                res.send({
                    "status": 400,
                    "message": "email/password is not valid please try again"
                })
            }
        }
    } catch (error) {
        console.log(error.message)
    }
})
Router.post("/tasks/:id", authenticateToken, async (req, res, next) => {
    try {
        console.log(req.body)
        const id = req.params.id
        const isUser = await User.findById(id)
        const newTask = req.body
        if (isUser === null) {
            res.send("User Not found")
        } else if (isUser) {
            const result = await User.updateOne(
                { _id: id },
                { $push: { tasks: newTask } },
                { runValidators: true });
            res.send(result)
        } else {
            res.send("error")
        }
    } catch (error) {
        if (error.name === "CastError") {
            res.send("User Not found")
        } else if (error.name === "ValidationError") {
            res.send("Please provide all inputs")
        }
        console.log(error.message)
    }
})
Router.patch("/taskUpdate/:userId/task/:taskId", authenticateToken, async (req, res, next) => {
    const { userId, taskId } = req.params
    const update = req.body
    try {
        const isUser = await User.findById(userId)
        if (isUser) {
            const updateTask = await User()
            res.send(updateTask)
        } else {
            res.send("else")
        }
    } catch (error) {
        if (error.name === "ObjectParameterError") {
            res.status(400).json({
                status: "failure",
                message: "please check syntax details"
            })
        }
        console.log(error.message)
    }
})

Router.get("/:id", authenticateToken, async (req, res, next) => {
    try {
        
        const id = req.params.id
        const isUser = await User.findById(id)
        if (isUser) {
            res.status(200).json({
                status: "success",
                data: isUser.tasks
            })
        } else {
            res.status(400).json({
                status: "failure",
                message: "User Not found"
            })
        }
    } catch (error) {
        console.log(error.message)
    }
})
module.exports = Router