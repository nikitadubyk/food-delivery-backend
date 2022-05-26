const express = require('express')
const {
    createUser,
    login,
    findUser,
} = require('../controllers/user-controller')

const router = express.Router()

router.post('/signup', createUser)
router.post('/login', login)
router.post('/:id', findUser)

module.exports = router
