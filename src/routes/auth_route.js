const authController = require('../controllers/auth_controller')
const express = require('express')

const router = express.Router()

router.post('/login', authController.login)

module.exports = router