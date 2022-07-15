const nodemailer = require('nodemailer')

const User = require('../models/user')
const Order = require('../models/order')
const Market = require('../models/market')
const HttpError = require('../models/http-error')

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
        name,
        order,
        phone,
        address,
        delivery,
        totalPrice,
        date: new Date().toLocaleString(),
        restarautName: correctMarket.name,
    })

    try {
        await newOrder.save()
        await correctMarket.orders.push(newOrder._id)
        await correctMarket.save()
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
        host: 'smtp.mail.ru',
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD_EMAIL,
        },
    })

    let message = {
        from: `"Доставка еды" <${process.env.EMAIL}>`, // sender address
        to: correctMarket.email, // list of receivers
        subject: 'Новый заказ ✔',
        html: `<b>Пришел новый заказ!</b> <br/><br/>
        <b>Адрес</b> - ${address} <br/>
        <b>Тип доставки</b> - ${delivery} <br/>
        <b>Имя</b> - ${name} <br/>
        <b>Телефон</b> - ${phone}<br/><br/>
        <b>Заказ</b>: <br/>
        ${order
            .map(
                order =>
                    `<b>Товар:</b> ${order.title} x ${order.count} - ${
                        order.price * order.count
                    }₽ <br/>`
            )
            .join('')} 
        <br/><br/>

        <b>Общая сумма заказа:</b> ${totalPrice} рублей
        `,
    }

    transporter.sendMail(message, (error, info) => {
        if (error) {
            console.log(error.message)
            res.status(500).json({
                message: 'Упс, произошла ошибка при отправке письма',
            })
            return process.exit(1)
        }
    })

    res.status(200).json({ message: 'Заказ отправлен!' })
}

module.exports = { order }
