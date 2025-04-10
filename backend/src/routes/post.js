const express = require('express')
const router = express.Router()
const post = require('../controllers/post.js')
const image = require('../controllers/uploadImage.js')

router.get('/api/myitems', post.getMyItems)
router.post('/api/myitems', image.upload, post.addItem)
router.put('/api/myitems/:id', image.upload, post.updateItem)
router.get('/api/items/:id', post.getItem)
router.get('/api/items', post.getAllItems)
// router.get('/api/items/:id', post.getItemFavorite)
router.delete('/api/items/:id', post.deleteItem)

module.exports = router