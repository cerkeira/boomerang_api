const express = require('express');
const router = express.Router();
const productController = require('../controllers/product');

router.get('/', productController.getProduct);

router.post('/', productController.publishProduct);


module.exports = router
