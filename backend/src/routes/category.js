const express = require('express');
const router = express.Router();
const category = require('../controllers/category.js');

router.get('/api/categories', category.listCategory);
router.post('/api/categories', category.addCategory);
router.delete('/api/categories/:cateId', category.removeCategory);
router.get('/api/categories/:cateId', category.listCategoryPost)
module.exports = router;