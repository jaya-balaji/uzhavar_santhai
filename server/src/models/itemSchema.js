const mongoose = require("mongoose")

const itemSchema = new mongoose.Schema({
    name: String,
    stock: Number,
    price: Number,
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'adminModel',
        required: true
      }
})

const Item = mongoose.model("itemModel", itemSchema)
module.exports = Item