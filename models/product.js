const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const User = require('./user');
const Color = require('./color');
const Grade = require('./grade');
const ProductType = require('./productType');
const Size = require('./size');
const config = require('config');

const Product = sequelize.define('Product', {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    measurements: {
        type: DataTypes.STRING,
    },
    value: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    price_day: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    availability: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
    brand: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    productImage: {
        type: DataTypes.STRING,
        get() {
            const rawValue = this.getDataValue('productImage');
            return `${config.baseUrl}${rawValue}`;
        },
    },
});

Product.belongsTo(Size);
Product.belongsTo(ProductType);
Product.belongsTo(Color);
Product.belongsTo(Grade);
Product.belongsTo(User);

module.exports = Product;
