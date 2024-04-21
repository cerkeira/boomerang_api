const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Fee = sequelize.define('Fee', {
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
    }
});

module.exports = Fee;
