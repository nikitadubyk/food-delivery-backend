const HttpError = require('../models/http-error')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

const createUser = async (req, res, next) => {
    const { email, password, name } = req.body

    let existUser

    try {
        existUser = await User.find({ email: email })
    } catch (error) {
        return next(
            new HttpError('Не удалось зарегистрироваться, попробуйте еще', 422)
        )
    }

    if (existUser.length > 0) {
        return next(
            new HttpError(
                'Пользователь с такой почтой уже зарегистрирован!',
                422
            )
        )
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const createdUser = new User({
        email,
        password: hashedPassword,
        name,
    })

    try {
        await createdUser.save()
    } catch (error) {
        return next(
            new HttpError('Не удалось зарегистрироваться, попробуйте еще', 422)
        )
    }

    const token = jwt.sign(
        {
            userId: createUser.id,
        },
        process.env.SECRET_KEY,
        { expiresIn: '24h' }
    )

    const tokenExpiration = new Date().getTime() + 1000 * 60 * 60 * 24

    res.status(200).json({
        userId: createdUser.id,
        expiration: tokenExpiration,
        token,
    })
}

const login = async (req, res, next) => {
    const { email, password } = req.body

    let user
    try {
        user = await User.findOne({ email })
    } catch (error) {
        return next(
            new HttpError(
                'Не удалось войти, пользователь с такой почтой не найден',
                422
            )
        )
    }

    if (!user || user.length === 0) {
        return next(
            new HttpError('Не удалось найти пользователя с такой почтой', 422)
        )
    }

    const isValidPassword = bcrypt.compareSync(password, user.password)

    if (!isValidPassword) {
        return next(new HttpError('Неправильный пароль, попробуйте еще', 500))
    }

    const token = jwt.sign(
        {
            userId: user.id,
        },
        process.env.SECRET_KEY,
        { expiresIn: '24h' }
    )

    const tokenExpiration = new Date().getTime() + 1000 * 60 * 60 * 24

    res.status(200).json({
        userId: user.id,
        expiration: tokenExpiration,
        token,
    })
}

const findUserOrders = async (req, res, next) => {
    let user

    try {
        user = await User.findById(req.userData.userId, 'orders').populate(
            'orders'
        )
    } catch (error) {
        return next(new HttpError('Не удалось найти заказы пользователя', 422))
    }

    res.status(200).json(user)
}

module.exports = { createUser, login, findUserOrders }
