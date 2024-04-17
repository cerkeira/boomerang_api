const express = require('express');

const app = express();
const sequelize = require('./db');
const userRoutes = require('./routes/user');
const productRoutes = require('./routes/product');

app.use(express.json());

app.use('/user', userRoutes);
app.use('/product', productRoutes);


const PORT = process.env.PORT || 3000;
sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(
      `Servidor a correr na porta de trás. Estou a gozar, é mesmo na ${PORT}.`,
    );
  });
});
