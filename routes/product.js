const express = require('express');
const router = express.Router();
const productController = require('../controllers/product');
const { check } = require('express-validator');

router.get('/', productController.getProduct);

router.post('/', productController.publishProduct);
router.post('/', [
    check('title').notEmpty().withMessage('Title is required'),
    check('description').notEmpty().withMessage('Description is required'),
], productController.publishProduct);

router.put('/', [
    check('id').isInt().withMessage('Product ID must be an integer'),
    check('title').notEmpty().withMessage('Title is required'),
    check('description').notEmpty().withMessage('Description is required'),
], productController.editProduct);

router.delete('/', productController.deleteProduct);

router.get('/form', productController.getForm);

router.get('/search', productController.searchProducts);

module.exports = router;
