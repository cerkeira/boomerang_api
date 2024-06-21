const { Sequelize } = require('sequelize');
const process = require('process');
process.env.NODE_ENV = process.argv.slice(3);

const config = require('config');

const sequelize = new Sequelize(
    process.env.database || config.database,
    process.env.username || config.username,
    process.env.password || config.password,
    {
        host: process.env.host || config.host,
        dialect: process.env.dialect || config.dialect,
        // logging: false,
    }
);

module.exports = sequelize;
