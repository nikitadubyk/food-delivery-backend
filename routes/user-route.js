const express = require('express')
const {
    createUser,
    login,
    findUserOrders,
} = require('../controllers/user-controller')

const router = express.Router()

router.post('/signup', createUser)
router.post('/login', login)
router.post('/', findUserOrders)

module.exports = router
