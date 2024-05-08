const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Location = sequelize.define('Location', {
    name: {
        type: DataTypes.TEXT('medium'),
        allowNull: false,
    },
    address: {
        type: DataTypes.TEXT('medium'),
        allowNull: false,
    },
    postalCode: {
        type: DataTypes.STRING(10),
        allowNull: false,
    },
});

module.exports = Location;
