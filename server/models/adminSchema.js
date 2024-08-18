const mongoose = require("mongoose")

const adminSchema = new mongoose.Schema({
    name : String,
    location: String,
    phone: String,
    email: String,
    password: String
})

const Admin = mongoose.model("adminModel", adminSchema)
module.exports = Admin