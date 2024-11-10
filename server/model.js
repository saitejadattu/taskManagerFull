const mongoose = require("mongoose")
const taskSchema = new mongoose.Schema({
    task: {
        type: String,
        required: true
    },
    task_name: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    },
    updated: {
        type: Date,
        default: Date.now
    }
})
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    tasks: [taskSchema]
})

const User = mongoose.model("User", userSchema)

module.exports = User