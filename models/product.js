const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Product = sequelize.define('Product', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  measurements: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  value: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  price_day: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  availability: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  brand: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  product_types_id_product_types: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  color_id_color: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  grades_id_grades: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  sizes_id_sizes: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  users_id_users: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = Product;
