const express = require("express")
const User = require("./model.js")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const { reset } = require("nodemon")
const Router = express.Router()

const authentication = (req, res, next) => {
    try{
        let token = req.headers.authorization
        
        if(token){
            token = token.split(" ")[1]
            let user = jwt.verify(token, "DATTUBHAI")
            console.log(user)
        }else{
            res.send("invalid jwt token")
        }
        next()
    }catch(error){
        console.log(error)
    }
}
Router.get("/signup", async (req, res, next) => {
    try {
        const getAllUsers = await User.find()
        res.send(getAllUsers)
    } catch (error) {
        console.log(error)
    }
})
Router.post("/signup", async (req, res, next) => {
    try {
        const hashedPass = await bcrypt.hash(req.body.password, 10)
        const getAllUsers = await User({ ...req.body, password: hashedPass })
        const result = await getAllUsers.save()
        res.send(result)
    } catch (error) {
        if (error.code === 11000) {
            res.send("email address already exists")
        } else {
            console.log(error)
        }

    }
})
Router.post("/login", async (req, res, next) => {
    try {
        const findUser = await User.find({ email: req.body.email })
        const jwtToken = jwt.sign({ id: req.body._id }, "DATTUBHAI", { expiresIn: "1h" })
        if (findUser.length === 1) {
            res.send(jwtToken)
        } else {
            res.send("user not found")
        }
    } catch (error) {
        console.log(error)
    }
})
Router.get("/tasks", authentication, async (req, res, next) => {
    const findUser = await User.find()
    res.send(findUser)
})



module.exports = Router