require('dotenv').config();

const { Sequelize } = require('sequelize');
const arguments = require('process');
process.env.NODE_ENV = arguments.argv.slice(3);

const config = require('config');
const sequelize = new Sequelize(
    config.database || process.env.DATABASE,
    config.username || process.env.USERNAME,
    config.password || process.env.PASSWORD,
    {
        host: config.host || process.env.HOST,
        dialect: config.dialect || process.env.DIALECT,
        // logging: false,
    }
);

module.exports = sequelize;
