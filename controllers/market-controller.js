const mongoose = require('mongoose')
const Market = require('../models/market')

const getAllMarket = (req, res, next) => {
    res.status(200).json({ message: 'Get all market' })
}

const createMarket = async (req, res, next) => {
    const { name, timeDelivery, priceDelivery } = req.body

    const newMarket = new Market({
        name,
        image: 'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg',
        timeDelivery,
        priceDelivery,
    })

    try {
        await newMarket.save()
    } catch (error) {
        console.log(error.mesage)
    }

    res.status(200).json({ market: newMarket.toObject({ getters: true }) })
}

module.exports = { getAllMarket, createMarket }
