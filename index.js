const express = require('express')
const session = require('express-session')

const app = express()
const sequelize = require('./db')
const userRoutes = require('./routes/user')
const productRoutes = require('./routes/product')
const stateRoutes = require('./routes/state')
const defineAssociations = require('./models/associations')

app.use(express.json())

app.use(
    session({
        secret: 'tangohiaTouRingaIRakuPacifier',
        resave: false,
        saveUninitialized: true,
        cookie: {
            // secure: true,
            httpOnly: true,
        },
    })
)

app.use('/user', userRoutes)
app.use('/product', productRoutes)
app.use('/state', stateRoutes)

defineAssociations()

const PORT = 3000
sequelize
    .sync({
        // force: true,
    })
    .then(() => {
        app.listen(PORT, () => {
            console.log(
                `Servidor a correr na porta de trás. Estou a gozar, é mesmo na ${PORT}.`
            )
        })
    })
