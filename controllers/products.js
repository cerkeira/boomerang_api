const Product = require('../models/products');

const product = {
  create(productData) {
    return Product.create(productData);
  },
  findForm() {
    return Product.findForm();
  },
  update(productId, productData) {
    return Product.update(productId, productData);
  },
  findProduct(productId) {
    return Product.findProduct(productId);
  },
  deleteProduct(productId) {
    return Product.deleteProduct(productId);
  }
};

module.exports = product;
