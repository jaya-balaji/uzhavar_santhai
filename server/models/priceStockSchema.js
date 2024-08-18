const mongoose = require('mongoose')

const priceSchema = new mongoose.Schema({
    itemId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'itemModel',
        required: true
      },
    price: String,
    stock: String,
    date: String
})

const Price = mongoose.model('priceModel',priceSchema)
module.exports = Price
