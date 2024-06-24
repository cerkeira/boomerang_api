const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Notification = sequelize.define('Notification', {
    type: {
        type: DataTypes.ENUM('transaction', 'favorite'),
        allowNull: false
    },
    title: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    read: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    TransactionId: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    UserId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    ProductId: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    FavoriteId: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
});


module.exports = Notification;
