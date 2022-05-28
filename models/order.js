const mongoose = require('mongoose')

const Schema = mongoose.Schema

const orderSchema = new Schema({
    address: { type: String },
    delivery: { type: String, required: true },
    name: { type: String, required: true },
    order: { type: Object, required: true },
    phone: { type: String, required: true },
})

module.exports = mongoose.model('Order', orderSchema)
