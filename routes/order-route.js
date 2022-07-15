const express = require('express')

const checkAuth = require('../middleware/check-auth')
const { order } = require('../controllers/order-controller')

const router = express.Router()

router.use(checkAuth)
router.post('/', order)

module.exports = router
