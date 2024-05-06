const express = require('express');

const app = express();
const sequelize = require('./db');
const userRoutes = require('./routes/user');
const productRoutes = require('./routes/product');
const stateRoutes = require('./routes/state');

app.use(express.json());

app.use('/users', userRoutes);
app.use('/products', productRoutes);
app.use('/states', stateRoutes);

const PORT = process.env.PORT || 3000;
sequelize
    .sync({
        force: true,
    })
    .then(() => {
        app.listen(PORT, () => {
            console.log(
                `Servidor a correr na porta de trás. Estou a gozar, é mesmo na ${PORT}.`
            );
        });
    });
