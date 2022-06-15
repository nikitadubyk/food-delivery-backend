const express = require('express')
const checkAdmin = require('../middleware/check-admin')
const findMarket = require('../middleware/find-market')
const {
    login,
    signup,
    getAllInfoMarket,
    patchInfoMarket,
    createFilter,
    deleteFilter,
    createFood,
    patchFood,
    deleteFood,
} = require('../controllers/admin-controller')

const router = express.Router()

router.post('/login', login)
router.post('/signup', signup)

router.use(checkAdmin)
router.use(findMarket)

// Работа с рестораном
router.get('/market', getAllInfoMarket)
router.patch('/market', patchInfoMarket)

// Работа с фильтрами
router.post('/filter', createFilter)
router.delete('/filter', deleteFilter)

// Работа с едой
router.post('/food', createFood)
router.patch('/food/:id', patchFood)
router.delete('/food/:id', deleteFood)

module.exports = router
