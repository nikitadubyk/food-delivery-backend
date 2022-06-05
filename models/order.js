const mongoose = require('mongoose')

const Schema = mongoose.Schema

const orderSchema = new Schema({
    address: { type: String },
    date: { type: Date, required: true },
    delivery: { type: String, required: true },
    name: { type: String, required: true },
    order: [
        {
            title: { type: String, required: true },
            count: { type: Number, required: true },
            price: { type: Number, required: true },
        },
    ],
    phone: { type: String, required: true },
    totalPrice: { type: Number, required: true },
    restarautName: {
        type: String,
        required: true,
    },
})

module.exports = mongoose.model('Order', orderSchema)
