const db = require('../db/index');

const product = {
  create(productData) {
    const {
      title,
      description,
      measurements,
      value,
      price_day,
      date,
      availability,
      brand,
      product_types_id_product_types,
      color_id_color,
      grades_id_grades,
      sizes_id_sizes,
      users_id_users
    } = productData;

    const query = `
      INSERT INTO products (
        title,
        description,
        measurements,
        value,
        price_day,
        date,
        availability,
        brand,
        product_types_id_product_types,
        color_id_color,
        grades_id_grades,
        sizes_id_sizes,
        users_id_users
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;

    const values = [
      title,
      description,
      measurements,
      value,
      price_day,
      date,
      availability,
      brand,
      product_types_id_product_types,
      color_id_color,
      grades_id_grades,
      sizes_id_sizes,
      users_id_users
    ];

    return db.query(query, values);
  }
};

module.exports = product;
