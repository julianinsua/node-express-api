const express = require('express')
const bodyParser = require('body-parser')
const feedRoutes = require('./src/routes/feedRoutes')

const app = express()

app.use(bodyParser.json())

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    next()
})

// ROUTES
app.use('/feed', feedRoutes)

app.listen(8080)