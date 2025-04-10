const express = require('express');
const router = express.Router();
const favorite = require('../controllers/favorite.js');

router.post('/api/myfavorites/:postId', favorite.addFavorite);
router.get('/api/myfavorites', favorite.listFavorites);
router.delete('/api/myfavorites/:postId', favorite.removeFavorite);

module.exports = router;