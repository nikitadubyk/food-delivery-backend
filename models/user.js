const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    email: { type: String, require: true, unique: true },
    password: { type: String, require: true },
    name: { type: String, require: true },
    orders: [{ type: mongoose.Types.ObjectId, required: true, ref: 'Order' }],
})

module.exports = mongoose.model('User', userSchema)
