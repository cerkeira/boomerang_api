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
const swaggerJsdoc = require('swagger-jsdoc');

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
    cors({ origin: 'http://localhost:3001', credentials: true })
);

app.use('/user', userRoutes);
app.use('/product', productRoutes);
app.use('/favorite', favoriteRoutes);
app.use('/state', stateRoutes);
app.use('/location', locationRoutes);

defineAssociations();

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Boomerang API',
            version: '0.98',
        },
        servers: [
            {
                url: 'http://localhost:3000/',
            },
        ],
    },
    apis: [
        './routes/user.js',
        './routes/product.js',
        './routes/location.js',
        './routes/favorite.js',
    ],
};

const specs = swaggerJsdoc(options);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

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
