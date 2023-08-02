const router = require('express').Router()
const authRoutes = require('./auth.routes')
const messageRoutes = require('./message.routes')

router.use('/auth', authRoutes)
router.use('/message', messageRoutes)

module.exports = router
