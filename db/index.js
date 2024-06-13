const { Sequelize } = require('sequelize');
const process = require('process');
process.env.NODE_ENV = process.argv.slice(3);

const config = require('config');

const sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    {
        host: config.host,
        dialect: config.dialect,
        // logging: false,
    }
);

module.exports = sequelize;
