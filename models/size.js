const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Size = sequelize.define('Size', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  });

  module.exports = Size;
