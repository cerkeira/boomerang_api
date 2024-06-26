require('dotenv').config();
const pg = require('pg');
const { Sequelize } = require('sequelize');
const argument = require('process');
process.env.NODE_ENV = argument.argv.slice(3);
let dialectModule = '';

const config = require('config');
// definir dialectModule para evitar erro de falta de pg no Vercel
if (process.env.DIALECT === 'postgres') {
    dialectModule = pg;
}

const sequelize = new Sequelize(
    config.database || process.env.DATABASE,
    config.username || process.env.USERNAME,
    config.password || process.env.PASSWORD,
    {
        host: config.host || process.env.HOST,
        dialect: config.dialect || process.env.DIALECT,
        dialectModule: dialectModule,
        // logging: false,
    }
);

module.exports = sequelize;
