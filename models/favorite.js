const sequelize = require('../db');
const User = require('./user')
const Product = require('./product')
const { DataTypes } = require('sequelize');

const Favorite = sequelize.define('Favorite', {
    productId: { type: DataTypes.INTEGER, references: { model: Product } },
    userId: { type: DataTypes.INTEGER, references: { model: User } }

}, {
    timestamps: false
});


module.exports = Favorite;
