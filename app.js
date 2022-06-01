const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const express = require('express')
const HttpError = require('./models/http-error')

const marketRoute = require('./routes/market-route')
const userRoute = require('./routes/user-route')
const orderRoute = require('./routes/order-route')

const app = express()

app.use(bodyParser.json())

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    )
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PATCH, DELETE')
    next()
})

app.use('/api/market', marketRoute)

app.use('/api/users', userRoute)

app.use('/api/order', orderRoute)

app.use((req, res, next) => {
    const error = new HttpError('Could not find this route', 404)
    throw error
})

app.use((error, req, res, next) => {
    res.status(error.code || '500')
    res.json({ message: error.message || 'An unknown error!' })
})

mongoose
    .connect(
        `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.sd3bq.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
    )
    .then(() => {
        app.listen('5000')
    })
    .catch(err => console.log('Connection to DB failed!'))
