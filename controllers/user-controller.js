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
        return next(new HttpError('Signup is failed, try again', 422))
    }

    if (existUser.length > 0) {
        return next(
            new HttpError('User with this email has been registered!', 422)
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
        console.log(error.message)
        return next(new HttpError('Signup failed, try again', 422))
    }

    const token = jwt.sign(
        {
            userEmail: createUser.email,
            userId: createUser.id,
        },
        process.env.SECRET_KEY,
        { expiresIn: '5h' }
    )

    res.status(200).json({
        userId: createdUser.id,
        userEmail: createdUser.email,
        token,
    })
}

const login = async (req, res, next) => {
    const { email, password } = req.body

    let user
    try {
        user = await User.findOne({ email })
    } catch (error) {
        return next(new HttpError('Login failed, could not find the user', 422))
    }

    !user.length === 0 &&
        next(new HttpError('Login failed, could not find the user', 422))

    const isValidPassword = bcrypt.compareSync(password, user.password)

    !isValidPassword && next(new HttpError('Password is wrong, try again', 500))

    const token = jwt.sign(
        {
            userEmail: user.email,
            userId: user.id,
        },
        process.env.SECRET_KEY,
        { expiresIn: '5h' }
    )

    res.status(200).json({
        userId: user.id,
        userEmail: user.email,
        token,
    })
}

module.exports = { createUser, login }
