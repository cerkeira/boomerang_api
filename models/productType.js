const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const ProductType = sequelize.define('ProductTypes', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,
    },
});

module.exports = ProductType;
