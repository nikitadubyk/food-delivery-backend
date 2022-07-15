const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    name: { type: String, require: true },
    password: { type: String, require: true },
    email: { type: String, require: true, unique: true },
    orders: [{ type: mongoose.Types.ObjectId, required: true, ref: 'Order' }],
})

module.exports = mongoose.model('User', userSchema)
