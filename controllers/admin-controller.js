const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const Admin = require('../models/admin')
const HttpError = require('../models/http-error')

const login = async (req, res, next) => {
    const { email, password } = req.body

    let correctAdmin

    try {
        correctAdmin = await Admin.findOne({ email })
    } catch (error) {
        return next(
            new HttpError(
                'Не удалось найти администратора, попробуйте позже',
                500
            )
        )
    }

    if (!correctAdmin || correctAdmin.length === 0) {
        return next(
            new HttpError(
                'Не удалось найти администратора, попробуйте позже',
                500
            )
        )
    }

    const isValidPassword = await bcrypt.compare(
        password,
        correctAdmin.password
    )

    if (!isValidPassword) {
        return next(new HttpError('Неправильный пароль, попробуйте еще', 500))
    }

    const token = jwt.sign(
        {
            marketId: correctAdmin.marketId,
        },
        process.env.SECRET_KEY,
        { expiresIn: '30d' }
    )

    const tokenExpiration = new Date().getTime() + 1000 * 60 * 60 * 24 * 30

    res.status(200).json({
        token,
        expiration: tokenExpiration,
        marketId: correctAdmin.marketId,
    })
}

const signup = async (req, res, next) => {
    const { email, password, marketId } = req.body

    let existAdmin

    try {
        existAdmin = await Admin.find({ email: email })
    } catch (error) {
        return next(
            new HttpError(
                'Не удалось найти администратора, попробуйте позже',
                500
            )
        )
    }

    existAdmin.length > 0 &&
        next(
            new HttpError(
                'Администратор с данной почтой уже зарегистрирован',
                500
            )
        )

    const hashedPassword = await bcrypt.hash(password, 10)

    const newAdmin = new Admin({
        email,
        marketId,
        password: hashedPassword,
    })

    try {
        await newAdmin.save()
    } catch (error) {
        return next(
            new HttpError('Не удалось зарегистрировать администратора', 500)
        )
    }

    const token = jwt.sign(
        {
            marketId,
        },
        process.env.SECRET_KEY,
        { expiresIn: '30d' }
    )

    const tokenExpiration = new Date().getTime() + 1000 * 60 * 60 * 24 * 30

    res.status(200).json({
        token,
        marketId,
        expiration: tokenExpiration,
    })
}

const getAllInfoMarket = async (req, res, next) => {
    const market = req.market

    res.status(200).json(market.toObject({ getters: true }))
}

const patchInfoMarket = async (req, res, next) => {
    const { name, timeDelivery, priceDelivery } = req.body
    const market = req.market

    market.name = name
    market.timeDelivery = timeDelivery
    market.priceDelivery = priceDelivery

    try {
        await market.save()
    } catch (error) {
        return next(
            new HttpError('Не удалось обновить информацию о ресторане', 500)
        )
    }

    res.status(200).json(market.toObject({ getters: true }))
}

const createFilter = async (req, res, next) => {
    const market = req.market
    const { filter } = req.body

    try {
        await market.filters.push(filter)
        await market.save()
    } catch (error) {
        return next(new HttpError('Не удалось добавить фильтр', 500))
    }

    res.status(200).json(market.toObject({ getters: true }))
}

const deleteFilter = async (req, res, next) => {
    const market = req.market
    const { filter } = req.body

    try {
        await market.filters.pull(filter)
        await market.save()
    } catch (error) {
        return next(new HttpError('Не удалось удалить фильтр', 500))
    }

    res.status(200).json(market.toObject({ getters: true }))
}

const createFood = async (req, res, next) => {
    const {
        title,
        gramm,
        price,
        image,
        filter,
        calories,
        position,
        description,
    } = req.body
    const market = req.market

    const newFood = {
        title,
        image,
        gramm,
        price,
        filter,
        calories,
        description,
    }

    try {
        market.food.splice(position - 1, 0, newFood)
        await market.save()
    } catch (error) {
        return next(
            new HttpError(
                'Не удалось добавить еду в ресторан, попробуйте еще',
                500
            )
        )
    }

    res.status(200).json(market.food.toObject({ getters: true }))
}
const patchFood = async (req, res, next) => {
    const { id } = req.params
    const market = req.market
    const { title, description, price } = req.body

    market.food.map(food => {
        if (food.id === id) {
            food.title = title
            food.price = price
            food.description = description
        }
    })

    try {
        await market.save()
    } catch (error) {
        return next(new HttpError('Не удалось обновить товар', 500))
    }

    res.status(200).json(market.food.toObject({ getters: true }))
}
const deleteFood = async (req, res, next) => {
    const { id } = req.params
    const market = req.market

    market.food = market.food.filter(food => food.id !== id)

    try {
        await market.save()
    } catch (error) {
        return next(new HttpError('Не удалось удалить товар', 500))
    }

    res.status(200).json({ message: 'Товар удален!' })
}

module.exports = {
    login,
    signup,
    patchFood,
    createFood,
    deleteFood,
    createFilter,
    deleteFilter,
    patchInfoMarket,
    getAllInfoMarket,
}
