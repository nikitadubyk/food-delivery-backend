const express = require('express')

const checkAdmin = require('../middleware/check-admin')
const findMarket = require('../middleware/find-market')
const {
    login,
    signup,
    patchFood,
    createFood,
    deleteFood,
    createFilter,
    deleteFilter,
    patchInfoMarket,
    getAllInfoMarket,
} = require('../controllers/admin-controller')

const router = express.Router()

router.post('/login', login)
router.post('/signup', signup)

router.use(checkAdmin)

// Работа с рестораном
router.get('/market', findMarket, getAllInfoMarket)
router.patch('/market', findMarket, patchInfoMarket)

// Работа с фильтрами
router.post('/filter', findMarket, createFilter)
router.delete('/filter', findMarket, deleteFilter)

// Работа с едой
router.post('/food', findMarket, createFood)
router.patch('/food/:id', findMarket, patchFood)
router.delete('/food/:id', findMarket, deleteFood)

module.exports = router
