const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Product = require('./product');

const User = sequelize.define('User', {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    gender: {
        type: DataTypes.STRING,
    },
    password: {
        type: DataTypes.STRING,
    },
    bio: {
        type: DataTypes.STRING,
    },
});

User.hasMany(Product, { foreignKey: 'UserId', as: 'products' });

module.exports = User;
