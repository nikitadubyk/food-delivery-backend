const express = require('express')

const {
    getAllMarket,
    createMarket,
    getMarketById,
    addNewFoodToMarket,
} = require('../controllers/market-controller')

const router = express.Router()

router.get('/', getAllMarket)
router.get('/:id', getMarketById)
router.post('/', createMarket)
router.post('/:id', addNewFoodToMarket)

module.exports = router
