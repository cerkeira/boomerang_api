const express = require('express');
const router = express.Router();
const Product = require('../controllers/products');

router.post('/', async (req, res) => {
  try {
    const productData = req.body; 
    productData.measurements = JSON.stringify(productData.measurements);
    const result = await Product.create(productData);
    console.log("Product Inserted");
    res.json({ message: 'Product inserted successfully', result });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
