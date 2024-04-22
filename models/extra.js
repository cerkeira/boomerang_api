const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Extra = sequelize.define('Extra', {
    name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    value: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
});

module.exports = Extra;
