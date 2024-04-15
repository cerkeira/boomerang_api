// // const { Pool } = require('pg');
//
//
// // const pool = new Pool({
// //     user: `${process.env.DB_USER}`,
// //     host: `${process.env.DB_HOST}`,
// //     database: `${process.env.DB_NAME}`,
// //     password: `${process.env.DB_PASSWORD}`,
// //     connectionString: `${process.env.CON_STRING}`,
// //   });
//
// const mysql = require('mysql2/promise');
//
//
//   const pool = mysql.createPool({
//     multipleStatements: true,
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     database: process.env.DB_NAME,
//     password: process.env.DB_PASSWORD,
//   });
//
//   module.exports = pool;



const Sequelize = require("sequelize");
const UserModel = require("../models/user");

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: "mysql",
    }
);

const db = {
    UserModel: UserModel,
};

Object.keys(db).forEach((key) => {
    if (db[key]["associate"]) {
        db[key].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
