const router = require('express').Router()
const controller = require('../controller/message.controller')
const auth = require('../middleware/authVerify')

router.post('/create', auth, ...controller.create)
router.get('/receivers', auth, controller.getUserReceiver)
router.get('/:userId', auth, ...controller.getMessageByUser)

module.exports = router