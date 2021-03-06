const Market = require('../models/market')
const HttpError = require('../models/http-error')

const getAllMarket = async (req, res, next) => {
    let market

    try {
        market = await Market.find({})
    } catch (error) {
        return next(new HttpError('Не удалось получить все рестораны', 500))
    }

    res.status(200).json(
        market.map(market => market.toObject({ getters: true }))
    )
}

const getMarketById = async (req, res, next) => {
    const marketId = req.params.id

    let market

    try {
        market = await Market.findById(marketId)
    } catch (error) {
        return next(new HttpError('Не удалось найти ресторан по id', 500))
    }

    res.json(market.toObject({ getters: true }))
}

const createMarket = async (req, res, next) => {
    const { email, name, priceDelivery, timeDelivery, filters, food } = req.body

    const newMarket = new Market({
        name,
        food,
        email,
        filters,
        timeDelivery,
        priceDelivery,
        image: 'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg',
    })

    try {
        await newMarket.save()
    } catch (error) {
        return next(new HttpError('Не удалось создать ресторан', 500))
    }

    res.status(200).json(newMarket.toObject({ getters: true }))
}

module.exports = {
    getAllMarket,
    createMarket,
    getMarketById,
}
