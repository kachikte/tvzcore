const express = require('express')
const router = express.Router()
const codeAttemptController = require('../controllers/code_attempt_controller')

router.post('/run', codeAttemptController.runCode)
router.post('/submit', codeAttemptController.submitCode)
router.get('/problems', codeAttemptController.getProlems)
router.post('/problems', codeAttemptController.addProblem)
router.get('/attempts', codeAttemptController.getAttempts)
router.post('/user-attempt', codeAttemptController.getAttemptsByUser)


module.exports = router