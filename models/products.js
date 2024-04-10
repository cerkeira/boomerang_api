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
  },

  findForm() {

    const query = `SELECT DISTINCT * FROM sizes ORDER BY id_sizes;
    SELECT DISTINCT * FROM product_types ORDER BY category;
    SELECT DISTINCT * FROM color ORDER BY name;
    SELECT DISTINCT * FROM grades ORDER BY id_grades`;

  ;
    return db.query(query);
  },
  
  findProduct(productId){

      const {
        id
      } = productId
    
      const query = `
      SELECT products.id_products, products.title, products.description, products.value, products.price_day, products.date, products.availability, products.brand, product_types.category, product_types.name AS 'product_type', product_types.measurements AS 'measurement_names', products.measurements AS 'measurement_values', color.name AS 'color', grades.name AS 'grade', sizes.name AS 'size', users.id_users, users.name FROM products INNER JOIN product_types ON products.product_types_id_product_types = product_types.id_product_types INNER JOIN color ON products.color_id_color = color.id_color INNER JOIN grades ON products.grades_id_grades = grades.id_grades INNER JOIN sizes ON products.sizes_id_sizes = sizes.id_sizes INNER JOIN users ON products.users_id_users = users.id_users WHERE products.id_products LIKE ?
    `;

    const values = [
      id
    ];
    return db.query(query, values);
  },

  deleteProduct(productId){

    const {
      id
    } = productId
  
    const query = `
    DELETE FROM products WHERE id_products LIKE ?
  `;

  const values = [
    id
  ];
  return db.query(query, values);
},

update(productId, productData) {

  const {
    title,
    description,
    measurements,
    value,
    price_day,
    availability,
    brand,
    color,
    grade,
    size
  } = productData;
  const {
    id
  } = productId;

  let query = `UPDATE products SET`;

  const values = [];

  if (title !== undefined && title !== null && title !== '') {
    query += ' title = ?,';
    values.push(title);
  }
  if (description !== undefined && description !== null && description !== '') {
    query += ' description = ?,';
    values.push(description);
  }
  if (measurements !== undefined && measurements !== null && measurements !== '') {
    query += ' measurements = ?,';
    values.push(measurements);
  }
  if (value !== undefined && value !== null && value !== '') {
    query += ' value = ?,';
    values.push(value);
  }
  if (price_day !== undefined && price_day !== null && price_day !== '') {
    query += ' price_day = ?,';
    values.push(price_day);
  }
  if (availability !== undefined && availability !== null && availability !== '') {
    query += ' availability = ?,';
    values.push(availability);
  }
  if (brand !== undefined && brand !== null && brand !== '') {
    query += ' brand = ?,';
    values.push(brand);
  }
  if (color !== undefined && color !== null && color !== '') {
    query += ' color_id_color = ?,';
    values.push(color);
  }
  if (grade !== undefined && grade !== null && grade !== '') {
    query += ' grades_id_grades = ?,';
    values.push(grade);
  }
  if (size !== undefined && size !== null && size !== '') {
    query += ' sizes_id_sizes = ?,';
    values.push(size);
  }

  if (values.length > 0) {
    query = query.slice(0, -1);
    query += ' WHERE id_products = ?';
    values.push(productId);
  } else {
    return null;
  }

  return db.query(query, values);
}


};

module.exports = product;
