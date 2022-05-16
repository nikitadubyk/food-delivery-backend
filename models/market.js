const mongoose = require('mongoose')

const Schema = mongoose.Schema

const marketSchema = new Schema({
    name: { type: String, required: true, unique: true },
    image: { type: String, required: true },
    timeDelivery: { type: Number, required: true },
    priceDelivery: { type: Number, required: true },
    filters: [],
    menu: [
        // {
        //     title: { type: String, required: true },
        //     description: { type: String, required: true },
        //     grams: { type: Number },
        //     price: { type: Number, require: true },
        // },
    ],
})

module.exports = mongoose.model('Market', marketSchema)
