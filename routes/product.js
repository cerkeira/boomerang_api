const express = require('express');
const router = express.Router();
const productController = require('../controllers/product');
const { check } = require('express-validator');
const upload = require('../db/middleware/multerConfig');

router.get('/', productController.getProduct);

router.post(
    '/',
    upload.single('productImage'),
    [
        check('title').notEmpty().withMessage('Title is required'),
        check('description').notEmpty().withMessage('Description is required'),
    ],
    productController.publishProduct
);

router.put(
    '/',
    upload.single('productImage'),
    [
        check('id').isInt().withMessage('Product ID must be an integer'),
        check('title').notEmpty().withMessage('Title is required'),
        check('description').notEmpty().withMessage('Description is required'),
    ],
    productController.editProduct
);

router.delete('/', productController.deleteProduct);

router.get('/form', productController.getForm);

router.get('/search', productController.searchProducts);

module.exports = router;
