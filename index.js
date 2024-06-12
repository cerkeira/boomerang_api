const express = require('express');
const session = require('express-session');
const cors = require('cors');
const passport = require('passport');

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

const authRoutes = require('./routes/auth');
const PORT = 3000;

app.use(express.json());
app.use(
    session({
        secret: process.env.SESSION_SECRET || 'very_secret_key',
        resave: false,
        saveUninitialized: true,
        cookie: {
            httpOnly: true,
        },
    }),
    cors({ origin: 'http://localhost:3001', credentials: true })
);
app.use(express.static('uploads'));

require('./db/passport');
app.use(passport.initialize());
app.use(passport.session());

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

app.use('/user', userRoutes);
app.use('/product', productRoutes);
app.use('/state', stateRoutes);
app.use('/auth', authRoutes);

app.get('/profile', (req, res) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/');
    }
    res.send(`Hello, ${req.user.displayName}`);
});

app.get('/', (req, res) => {
    res.send('<a href="/auth/google">Sign in with Google</a>');
});

defineAssociations();

sequelize.sync({}).then(() => {
    app.listen(PORT, () => {
        console.log(
            `Servidor a correr na porta de trás. Estou a gozar, é mesmo na ${PORT}.`
        );
    });
});
