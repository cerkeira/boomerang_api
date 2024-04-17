const Product = require('../models/product');
const { Sequelize } = require('sequelize');


exports.getProduct = async (req, res) => {
  try {
    const { id } = req.query;
    const product = await Product.findAll({
        where: {
            id_products: {
              [Sequelize.Op.like]: `%${id}%`,
            },
          },
      attributes: [
        'title',
        'description',
        'measurements',
        'value',
        'price_day',
        'date',
        'availability',
        'brand',
        'product_types_id_product_types',
        'color_id_color',
        'sizes_id_sizes',
        'users_id_users',

      ],
    });

    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Fraco...' });
  }
};
