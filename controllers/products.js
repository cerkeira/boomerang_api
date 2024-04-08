const Product = require('../models/products');

const product = {
  create(productData) {
    return Product.create(productData);
  }
};

module.exports = product;
