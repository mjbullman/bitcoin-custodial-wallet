require('dotenv').config()
const cors = require('cors')
const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

const app = express()
const PORT = process.env.PORT || 8080

app.use(cors({
    origin: process.env.BASE_URL,
    credentials: true
}))

app.use(bodyParser.json())
app.use(cookieParser())

// import routes.
const authRoutes = require('./src/routes/authRoutes')
const plaidRoutes = require('./src/routes/plaidRoutes')
const bitcoinRoutes = require('./src/routes/bitcoinRoutes')

// use routes
app.use('/api/auth', authRoutes)
app.use('/api/plaid', plaidRoutes)
app.use('/api/bitcoin/', bitcoinRoutes)

// start server listening on port.
app.listen(PORT, () =>{
    console.log(`Server listening on port: ${PORT}`)
})