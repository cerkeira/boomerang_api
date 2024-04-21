const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Coupon = sequelize.define('Coupon', {
    name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    value: {
        type: DataTypes.INTEGER,
        defaultValue: null
    },
    percentage: {
        type: DataTypes.INTEGER,
        defaultValue: null
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    availability: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    }
});

module.exports = Coupon;
