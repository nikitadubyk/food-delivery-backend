const express = require('express')

const {
    getAllMarket,
    createMarket,
    getMarketById,
} = require('../controllers/market-controller')

const router = express.Router()

router.get('/', getAllMarket)
router.get('/:id', getMarketById)
router.post('/', createMarket)

module.exports = router
