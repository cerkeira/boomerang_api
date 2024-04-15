// const express = require('express')
// const app = express()
// require('dotenv').config();
// const pool = require ('./db/index')
// const port = process.env.PORT;
//
//
// app.use(express.json());
//
// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });
//
// // pool.connect((err, client, done) => {
// //   if (err) {
// //     console.error('Error connecting to the database', err);
// //   } else {
// //     console.log('Connected to the database');
// //   }
// // });
//
// const usersRoute = require('./routes/users');
// app.use('/users', usersRoute);
//
// const productRoutes = require('./routes/products');
// app.use('/products', productRoutes);
//

require('dotenv').config();

const express = require("express");
const bodyParser = require("body-parser");
const userRoute = require("./routes/users");


// Create Express app
const app = express();

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Routes
app.use("/users", userRoute);

// Default route
app.get("/", (req, res) => {
  res.send("Welcome to the API!");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({ message: err.message });
});

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});