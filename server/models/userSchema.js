const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    name : String,
    phone: String,
    email: String,
    password: String
})

const User = mongoose.model("userModel", userSchema)
module.exports = User