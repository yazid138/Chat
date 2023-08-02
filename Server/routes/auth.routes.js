const router = require('express').Router()
const controller = require('../controller/auth.controller')
const auth = require('../middleware/authVerify')

router.post('/register', controller.register)
router.post('/login', controller.login)
router.get('/detail', auth, controller.detailUser)
router.delete('/logout', auth, controller.logout)

module.exports = router