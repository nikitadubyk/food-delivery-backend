const express = require('express')
const checkAuth = require('../middleware/check-auth')
const {
    createUser,
    login,
    findUserOrders,
} = require('../controllers/user-controller')

const router = express.Router()

router.post('/signup', createUser)
router.post('/login', login)
router.use(checkAuth)
router.post('/', findUserOrders)

module.exports = router
