const { Sequelize } = require('sequelize')
const process = require('process')
const envIndex = process.argv.indexOf('--env')
const env = envIndex !== -1 && process.argv[envIndex + 1]
        ? process.argv[envIndex + 1]
        : 'production'

const config = require(`${__dirname}/../config/config.json`)[env]

const sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    {
        host: config.host,
        dialect: config.dialect,
        // logging: false,
    }
)

module.exports = sequelize
