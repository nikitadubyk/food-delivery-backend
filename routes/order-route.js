const express = require('express')
const { order } = require('../controllers/order-controller')
const checkAuth = require('../middleware/check-auth')

const router = express.Router()

router.use(checkAuth)
router.post('/', order)

module.exports = router
