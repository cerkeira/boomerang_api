const express = require('express');
const router = express.Router();
const popularController = require('../controllers/popular');

router.get('/categories', popularController.getPopularCategories);


module.exports = router;
