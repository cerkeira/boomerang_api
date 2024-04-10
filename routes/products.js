const express = require('express');
const router = express.Router();
const Product = require('../controllers/products');

router.post('/new', async (req, res) => {
  try {
    const productData = req.body; 
    productData.measurements = JSON.stringify(productData.measurements);
    const result = await Product.create(productData);
    console.log("Product Inserted");
    res.json('Product inserted successfully');
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/forms', async (req, res) => {
  try {
    const result = await Product.findForm();
    console.log("Form Info Shown");
    res.json(result[0]);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/find', async (req, res) => {
  try {
    const productId = req.body; 
    const result = await Product.findProduct(productId);
    console.log("Product Info Shown");
    res.json(result[0]);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.delete('/delete', async (req, res) => {
  try {
    const productId = req.body; 
    const result = await Product.deleteProduct(productId);
    console.log("Product Deleted");
    res.json("Product deleted successfully");
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.put('/edit', async (req, res) => {
  try {
    const productId = req.body.id; 
    const productData = req.body; 
    productData.measurements = JSON.stringify(productData.measurements);
    const result = await Product.update(productId, productData);
    console.log("Product Edited");
    res.json('Product edited successfully');
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
