const roleController = require('../controllers/role_controller')

const express = require('express')

const router = express.Router()

router.post('/create', roleController.createRole)

router.post('/update', roleController.updateRole)

router.get('', roleController.listRoles)

module.exports = router