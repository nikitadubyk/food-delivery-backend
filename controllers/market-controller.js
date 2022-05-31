const Market = require('../models/market')
const HttpError = require('../models/http-error')

const getAllMarket = async (req, res, next) => {
    let market

    try {
        market = await Market.find({})
    } catch (error) {
        return next(new HttpError('Could not get all markets', 500))
    }

    res.status(200).json({
        markets: market.map(market => market.toObject({ getters: true })),
    })
}

const getMarketById = async (req, res, next) => {
    const marketId = req.params.id

    let market

    try {
        market = await Market.findById(marketId)
    } catch (error) {
        return next(new HttpError('Could not find market by id', 500))
    }

    res.json({ market: market.toObject({ getters: true }) })
}

const addNewFoodToMarket = async (req, res, next) => {
    const marketId = req.params.id

    const { title, description, calories, gramm, price, filter } = req.body

    const newFood = {
        title,
        image: 'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg',
        description,
        calories,
        gramm,
        price,
        filter,
    }

    let market

    try {
        market = await Market.findById(marketId)
    } catch (error) {
        return next(new HttpError('Could not find market by id', 500))
    }

    try {
        await market.food.push(newFood)
        await market.save()
    } catch (error) {
        return next(new HttpError('Could not add new food to market', 500))
    }

    res.json({ message: 'Food added success!' })
}

const createMarket = async (req, res, next) => {
    const { email, name, priceDelivery, timeDelivery, filters, food } = req.body

    const newMarket = new Market({
        name,
        email,
        image: 'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg',
        timeDelivery,
        priceDelivery,
        filters,
        food,
    })

    try {
        await newMarket.save()
    } catch (error) {
        return next(new HttpError('Could not create new market', 500))
    }

    res.status(200).json({ market: newMarket.toObject({ getters: true }) })
}

module.exports = {
    getAllMarket,
    createMarket,
    getMarketById,
    addNewFoodToMarket,
}
