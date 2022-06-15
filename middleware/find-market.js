const HttpError = require('../models/http-error')
const Market = require('../models/market')

module.exports = async (req, res, next) => {
    const { marketId } = req.adminData

    let market

    try {
        market = await Market.findById(marketId)
    } catch (error) {
        return next(
            new HttpError('Не удалось найти ресторан, попробуйте еще', 500)
        )
    }

    if (!market || market.length === 0) {
        return next(
            new HttpError('Не удалось найти ресторан, попробуйте еще', 500)
        )
    }

    req.market = market
    next()
}
