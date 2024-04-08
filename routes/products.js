const express = require('express');
const router = express.Router();
const Product = require('../controllers/product');

router.get('/', async (req, res) => {
    try {
      const products = await Product.findAll();
      console.log("Users Shown");
      res.json(users.rows);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  module.exports = router;
  