const mongoose = require("mongoose")

const uri = "mongodb://127.0.0.1:27017/practice2"

const connectToMongoDB = () =>{
    mongoose.connect(uri)
    .then(()=>console.log("mongoDB connected successfully"))
    .catch((error)=>console.log("Error while connecting to mongoDb", error.message))
}


module.exports = connectToMongoDB