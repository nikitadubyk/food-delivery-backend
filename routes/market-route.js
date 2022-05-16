const express = require('express')

const {
    getAllMarket,
    createMarket,
} = require('../controllers/market-controller')

const router = express.Router()

router.get('/', getAllMarket)
router.post('/', createMarket)

module.exports = router
