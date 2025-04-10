const express = require('express')
const router = express.Router()
const message = require('../controllers/messages.js')

router.get('/api/messages/:gid', message.listMessages)
router.post('/api/messages/:gid', message.addMessage)


module.exports = router
