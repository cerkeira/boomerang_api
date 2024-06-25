require('dotenv').config();

const express = require('express');
const session = require('express-session');
const cors = require('cors');
const passport = require('passport');
// eslint-disable-next-line import/no-extraneous-dependencies
const bodyParser = require('body-parser');
const app = express();
const sequelize = require('./db');
const userRoutes = require('./routes/user');
const popularRoutes = require('./routes/popular');
const transactionRoutes = require('./routes/transaction');
const notificationRoutes = require('./routes/notification');
const productRoutes = require('./routes/product');
const favoriteRoutes = require('./routes/favorite');
const locationRoutes = require('./routes/location');
const extraRoutes = require('./routes/extra');
const defineAssociations = require('./models/associations');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const googleRoutes = require('./routes/google');
const PORT = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
    session({
        secret: process.env.SESSION_SECRET || 'very_secret_key',
        resave: false,
        saveUninitialized: true,
        cookie: {
            secure: process.env.SECURE || 'false',
            httpOnly: true,
            sameSite: 'None',
        },
    }),
    cors({
        origin: [
            'http://localhost:3001',
            'http://localhost:3000',
            'https://boomerang.tdw-mctw.dev',
        ],
        methods: ['GET', 'PUT', 'POST', 'DELETE'],
        credentials: true,
    })
);

app.use(express.static('uploads'));

// route de teste de upload de ficheiros
// app.post('/api/upload', async (req, res) => {
//     try {
//         const filename = req.query.filename;

//         if (!filename) {
//             return res.status(400).json({ error: 'Filename is required' });
//         }

//         const blob = await put(filename, req.body, {
//             access: 'public',
//             token: process.env.BLOB_READ_WRITE_TOKEN,
//         });

//         return res.json(blob);
//     } catch (error) {
//         console.error('Error uploading file:', error);
//         return res.status(500).json({ error: 'Internal Server Error' });
//     }
// });

require('./db/passport');
app.use(passport.initialize());
app.use(passport.session());

// route de teste
// app.use('/', (req, res) => res.status(200).json({ message: 'Esta é a API da Boomerang' }));

app.use('/user', userRoutes);
app.use('/popular', popularRoutes);
app.use('/transaction', transactionRoutes);
app.use('/product', productRoutes);
app.use('/favorite', favoriteRoutes);
app.use('/location', locationRoutes);
app.use('/notification', notificationRoutes);
app.use('/google', googleRoutes);
app.use('/extra', extraRoutes);

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
                url: process.env.BASEURL || 'http://localhost:3000/',
            },
        ],
    },
    apis: [
        './routes/user.js',
        './routes/product.js',
        './routes/location.js',
        './routes/favorite.js',
        './routes/google.js',
        './routes/popular.js',
        './routes/transaction.js',
        './routes/extra.js',
    ],
};

const specs = swaggerJsdoc(options);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

sequelize
    .sync({
        // force: true,
        logging: true,
    })
    .then(() => {
        app.listen(PORT, () => {
            console.log(
                `Servidor a correr na porta de trás. Estou a gozar, é mesmo na ${PORT}.`
            );
        });
    });
