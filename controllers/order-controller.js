const nodemailer = require('nodemailer')
const HttpError = require('../models/http-error')
const Order = require('../models/order')
const Market = require('../models/market')
const User = require('../models/user')

const order = async (req, res, next) => {
    const { address, delivery, name, order, phone, totalPrice, restarautId } =
        req.body

    let correctMarket

    try {
        correctMarket = await Market.findById(restarautId)
    } catch (error) {
        return next(
            new HttpError('Не удалось найти ресторан, попробуйте еще раз', 500)
        )
    }

    correctMarket.length === 0 &&
        next(
            new HttpError('Не удалось найти ресторан, попробуйте еще раз', 500)
        )

    const newOrder = new Order({
        address,
        date: new Date().toLocaleString(),
        delivery,
        name,
        order,
        phone,
        totalPrice,
        restarautName: correctMarket.name,
    })

    try {
        await newOrder.save()
    } catch (error) {
        return next(new HttpError('Не удалось сохранить заказ', 500))
    }

    let correctUser

    try {
        correctUser = await User.findById(req.userData.userId)
    } catch (error) {
        return next(
            new HttpError(
                'Не удалось найти пользователя, попробуйте еще раз',
                500
            )
        )
    }

    correctUser.length === 0 &&
        next(
            new HttpError(
                'Не удалось найти пользователя, попробуйте еще раз',
                500
            )
        )

    try {
        correctUser.orders.push(newOrder._id)
        await correctUser.save()
    } catch (error) {
        return next(
            new HttpError(
                'Не удалось сохранить заказ у пользователя, попробуйте еще раз',
                500
            )
        )
    }

    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD_EMAIL,
        },
    })

    let info = await transporter.sendMail({
        from: `"Fred Foo 👻" <${process.env.EMAIL}>`, // sender address
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
