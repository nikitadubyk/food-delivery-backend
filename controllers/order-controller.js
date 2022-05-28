const HttpError = require('../models/http-error')
const Order = require('../models/order')

const order = async (req, res, next) => {
    const { address, delivery, name, order, phone } = req.body

    const newOrder = new Order({
        address,
        delivery,
        name,
        order,
        phone,
    })

    try {
        await newOrder.save()
    } catch (error) {
        return next(new HttpError('Failed to place an order, try again', 500))
    }

    res.status(200).json({ order: newOrder })
}

module.exports = { order }
