const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Grade = sequelize.define('Grades', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  });

  module.exports = Grade;
