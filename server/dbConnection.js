const mongoose = require("mongoose")
const URI = process.env.URI
const connectToMongoDB = () => {
    mongoose.connect(URI)
        .then(() => console.log("mongoDB connected successfully"))
        .catch((error) => console.log("Error while connecting to mongoDb", error.message))
}
mongoose.connection.on("connected", () => {
    console.log("MongoDB is connectefd to DataBase")
})
mongoose.connection.on("error", (err) => {
    console.log(err.message)
})
mongoose.connection.on("disconnected", () => {
    console.log("MongoDB is disconnected")
})
process.on("SIGINT", async () => {
    await mongoose.connection.close()
    process.exit(0)
})

module.exports = connectToMongoDB