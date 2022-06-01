const nodemailer = require('nodemailer')
const HttpError = require('../models/http-error')
const Order = require('../models/order')
const Market = require('../models/market')
const User = require('../models/user')

const order = async (req, res, next) => {
    const {
        address,
        delivery,
        name,
        order,
        phone,
        totalPrice,
        restarautId,
        userId,
    } = req.body

    const newOrder = new Order({
        address,
        delivery,
        name,
        order,
        phone,
        totalPrice,
        restarautId,
    })

    try {
        await newOrder.save()
    } catch (error) {
        return next(new HttpError('Failed to place an order, try again', 500))
    }

    let correctMarket

    try {
        correctMarket = await Market.findById(restarautId)
    } catch (error) {
        console.log(error.message)
        return next(new HttpError('Failed to find a market, try again', 500))
    }

    correctMarket.length === 0 &&
        next(new HttpError('Failed to find a market, try again', 500))

    let correctUser

    try {
        correctUser = await User.findById(userId)
    } catch (error) {
        return next(new HttpError('Failed to find a user, try again', 500))
    }

    correctUser.length === 0 &&
        next(new HttpError('Failed to find a user, try again', 500))

    try {
        correctUser.orders.push(newOrder)
        await correctUser.save()
    } catch (error) {
        return next(
            new HttpError('Failed to save order at user, try again', 500)
        )
    }

    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'bruce.corkery38@ethereal.email',
            pass: 'mn7T6Hpj8xwZRbj3D5',
        },
    })

    let info = await transporter.sendMail({
        from: '"Fred Foo 👻" <foo@example.com>', // sender address
        to: correctMarket.email, // list of receivers
        subject: 'Новый заказ ✔',
        html: `<b>Пришел новый заказ!</b> <br/><br/>
        <b>Адрес</b> - ${address} <br/>
        <b>Тип доставки</b> - ${delivery} <br/>
        <b>Имя</b> - ${name} <br/>
        <b>Телефон</b> - ${phone}<br/><br/>
        <b>Заказ</b>: <br/>
        ${order.map(
            order =>
                `<b>Товар:</b> ${order.title} - <b>Количество:</b> ${order.count} <br/>`
        )} <br/><br/>

        <b>Общая сумма заказа:</b> ${totalPrice} рублей
        `,
    })

    transporter.sendMail(info, (error, info) => {
        if (error) {
            res.status(500).json({
                message: 'Упс, произошла ошибка при отправке письма',
            })
            return process.exit(1)
        }
    })

    res.status(200).json({ message: 'Заказ отправлен!' })
}

module.exports = { order }
