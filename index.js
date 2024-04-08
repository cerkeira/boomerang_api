const express = require('express')
const app = express()
require('dotenv').config();
const pool = require ('./db/index')
const port = process.env.PORT;


app.use(express.json());

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// pool.connect((err, client, done) => {
//   if (err) {
//     console.error('Error connecting to the database', err);
//   } else {
//     console.log('Connected to the database');
//   }
// });

const usersRoute = require('./routes/users');
app.use('/users', usersRoute);

