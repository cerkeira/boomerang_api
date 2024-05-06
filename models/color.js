const { DataTypes } = require('sequelize')
const sequelize = require('../db')

const Color = sequelize.define('Color', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
})

module.exports = Color
