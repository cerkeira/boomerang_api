const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Transaction = sequelize.define('Transaction', {
    date_start: {
        type: DataTypes.DATE,
        allowNull: false
    },
    date_end: {
        type: DataTypes.DATE,
        allowNull: false
    },
    price_day: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    order: {
        type: DataTypes.JSON,
        allowNull: true
    },
    renterUserId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    ownerUserId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    ownerUserAddress: {
        type: DataTypes.JSON,
        allowNull: true
    },
    renterUserAddress: {
        type: DataTypes.JSON,
        allowNull: true
    },
    state: {
        type: DataTypes.ENUM('pending', 'approved', 'rejected', 'paid', 'canceled', 'shipping', 'transit', 'delivered', 'completed'),
        allowNull: false
    },
});

module.exports = Transaction;


