require('dotenv').config();

const express = require('express');
const session = require('express-session');
const cors = require('cors');
const passport = require('passport');
const bodyParser = require('body-parser');
const { deleteUncompressed } = require('./db/middleware/upload');
const app = express();
const sequelize = require('./db');
const userRoutes = require('./routes/user');
const popularRoutes = require('./routes/popular');
const transactionRoutes = require('./routes/transaction');
const productRoutes = require('./routes/product');
const favoriteRoutes = require('./routes/favorite');
const locationRoutes = require('./routes/location');
const defineAssociations = require('./models/associations');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const googleRoutes = require('./routes/google');
const PORT = 3000;

const streamifier = require('streamifier');
const sharp = require('sharp');
const { uploadBlob } = require('@vercel/blob');
const { upload } = require('./api/upload');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
    session({
        secret: process.env.SESSION_SECRET || 'very_secret_key',
        resave: false,
        saveUninitialized: true,
        cookie: {
            // secure: true,
            httpOnly: true,
        },
    }),
    cors({
        origin: process.env.CORS_ORIGIN || 'http://localhost:3001',
        credentials: true,
    })
);
deleteUncompressed();

app.use(express.static('uploads'));

require('./db/passport');
app.use(passport.initialize());
app.use(passport.session());

// app.use('/', (req, res) => res.status(200).json({ message: 'Esta é a API da Boomerang' }));
app.use('/api/upload', upload.single('productImage'), async (req, res) => {
    try {
        const stream = streamifier.createReadStream(req.file.buffer);
        const blob = await uploadBlob({
            name: `uploads/uncompressed/${req.file.originalname}`,
            body: stream,
            size: req.file.size,
            contentType: req.file.mimetype,
        });

        const compressedBuffer = await sharp(req.file.buffer)
            .resize({ width: 600, height: 600, fit: 'inside' })
            .toBuffer();

        const compressedStream = streamifier.createReadStream(compressedBuffer);
        const compressedBlob = await uploadBlob({
            name: `uploads/compressed-${req.file.originalname}`,
            body: compressedStream,
            size: compressedBuffer.length,
            contentType: req.file.mimetype,
        });

        res.status(200).json({
            message: 'File uploaded successfully',
            url: blob.url,
            compressedUrl: compressedBlob.url,
        });
    } catch (error) {
        console.error('Error uploading to Vercel Blob:', error);
        res.status(500).json({ error: 'Failed to upload to Vercel Blob' });
    }
});

app.use('/user', userRoutes);
app.use('/popular', popularRoutes);
app.use('/transaction', transactionRoutes);
app.use('/product', productRoutes);
app.use('/favorite', favoriteRoutes);
app.use('/location', locationRoutes);
app.use('/google', googleRoutes);

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
