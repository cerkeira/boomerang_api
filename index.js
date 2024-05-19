const express = require('express');
const session = require('express-session');
const cors = require('cors');

const app = express();
const sequelize = require('./db');
const userRoutes = require('./routes/user');
const productRoutes = require('./routes/product');
const favoriteRoutes = require('./routes/favorite');
const stateRoutes = require('./routes/state');
const locationRoutes = require('./routes/location');
const defineAssociations = require('./models/associations');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

app.use(express.json());

app.use(
    session({
        secret: 'tangohiaTouRingaIRakuPacifier',
        resave: false,
        saveUninitialized: true,
        cookie: {
            // secure: true,
            httpOnly: true,
        },
    }),
    cors()
);

app.use('/user', userRoutes);
app.use('/product', productRoutes);
app.use('/favorite', favoriteRoutes);
app.use('/state', stateRoutes);
app.use('/location', locationRoutes);

defineAssociations();

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const PORT = 3000;
sequelize
    .sync({
        // force: true,
    })
    .then(() => {
        app.listen(PORT, () => {
            console.log(
                `Servidor a correr na porta de trás. Estou a gozar, é mesmo na ${PORT}.`
            );
        });
    });
