const nodemailer = require('nodemailer')
const HttpError = require('../models/http-error')
const Order = require('../models/order')

const order = async (req, res, next) => {
    const { address, delivery, name, order, phone, totalPrice, restarautId } =
        req.body

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

    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
            user: 'green.lynch93@ethereal.email',
            pass: 'PNn63vNGKcTHP5C7ze',
        },
    })

    let info = await transporter.sendMail({
        from: '"Fred Foo 👻" <foo@example.com>', // sender address
        to: 'green.lynch93@ethereal.email', // list of receivers
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
