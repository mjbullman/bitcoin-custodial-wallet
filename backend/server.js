require('dotenv').config()
const cors = require('cors')
const express = require('express')
const bodyParser = require('body-parser')

const app = express()
const PORT = process.env.PORT || 8080

app.use(cors())
app.use(bodyParser.json())

// start server listening on port.
app.listen(PORT, () =>{
    console.log(`Server listening on port: ${PORT}`)
})