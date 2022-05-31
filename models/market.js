const mongoose = require('mongoose')

const Schema = mongoose.Schema

const marketSchema = new Schema({
    name: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    image: { type: String, required: true },
    priceDelivery: { type: String, required: true },
    timeDelivery: { type: String, required: true },
    filters: [],
    food: [
        {
            title: { type: String, required: true },
            image: { type: String, required: true },
            description: { type: String, required: true },
            calories: { type: String, required: true },
            gramm: { type: String, required: true },
            price: { type: Number, required: true },
            filter: { type: String, required: true },
        },
    ],
})

module.exports = mongoose.model('Market', marketSchema)
