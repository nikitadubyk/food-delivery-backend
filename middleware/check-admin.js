const jwt = require('jsonwebtoken')
const HttpError = require('../models/http-error')

module.exports = (req, res, next) => {
    if (req.method === 'OPTIONS') {
        return next()
    }

    try {
        const token = req.headers.authorization.split(' ')[1]

        if (!token) throw new Error('Администратор не авторизован')

        const decodedToken = jwt.verify(token, process.env.SECRET_KEY)
        req.adminData = { marketId: decodedToken.marketId }
        next()
    } catch (error) {
        return next(new HttpError('Администратор не авторизован', 401))
    }
}
