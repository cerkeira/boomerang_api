// const { Pool } = require('pg');


// const pool = new Pool({
//     user: `${process.env.DB_USER}`,
//     host: `${process.env.DB_HOST}`,
//     database: `${process.env.DB_NAME}`,
//     password: `${process.env.DB_PASSWORD}`,
//     connectionString: `${process.env.CON_STRING}`,
//   });

const mysql = require('mysql2/promise');


  const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
  });

  module.exports = pool;