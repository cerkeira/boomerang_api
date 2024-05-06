const express = require('express');
const router = express.Router();
const productController = require('../controllers/product');

router.get('/', productController.getProduct);

router.post('/', productController.publishProduct);

router.delete('/', productController.deleteProduct);

router.put('/', productController.editProduct);

router.get('/form', productController.getForm);

module.exports = router;
