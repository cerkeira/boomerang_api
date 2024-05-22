const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/favorite');
const { check } = require('express-validator');

router.get('/', favoriteController.getFavoriteProducts);

// router.post('/add', favoriteController.addToFavorites);
router.post('/add', [
    check('productId').isInt().withMessage('Product ID must be an integer'),
], favoriteController.addToFavorites);

router.post('/remove', favoriteController.removeFromFavorites);

module.exports = router;
