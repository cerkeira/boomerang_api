const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Transaction = sequelize.define('Transaction', {
    date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    price: {
        type: DataTypes.INTEGER,
        defaultValue: null
    },
    log: {
        type: DataTypes.JSON,
        allowNull: false
    },
    renterUserId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    ownerUserId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
});

module.exports = Transaction;


