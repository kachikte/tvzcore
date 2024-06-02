const userController = require('../controllers/user_controller')
const upload = require('../middleware/image_upload_middleware');
const express = require('express')

const router = express.Router()

router.post('/register', upload.single('image'), userController.registerUser);
router.get('/users', userController.listUsers)

module.exports = router