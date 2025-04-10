const express = require('express')
const router = express.Router()
const user = require('../controllers/user.js')
const image = require('../controllers/uploadImage.js')


router.get('/api/users', user.getUsers)
router.post('/api/users', image.upload, user.newUser)
router.put('/api/users/:id', user.updateUser)
router.delete('/api/users/:id', user.deleteUser)
router.post('/login', user.login)
router.put('/api/password', user.updatePwd)
// router.post('/api/profilePic', image.upload, image.uploadFiles)
module.exports = router