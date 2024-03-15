const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    name: String,
    age: Number
})

const UserModel = mongoose.model("User",userSchema)
module.exports = mongoose.model("User",userSchema)