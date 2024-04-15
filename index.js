const express = require('express');

const app = express();
const sequelize = require('./db');
const userRoutes = require('./routes/users');

app.use(express.json());

app.use('/users', userRoutes);

const PORT = process.env.PORT || 3000;
sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(
      `Servidor a correr na porta de trás. Estou a gozar, é mesmo na ${PORT}.`,
    );
  });
});
