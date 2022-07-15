const mongoose = require('mongoose')

const Schema = mongoose.Schema

const adminSchema = new Schema({
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    marketId: { type: mongoose.Types.ObjectId, required: true },
})

module.exports = mongoose.model('Admin', adminSchema)
