const express = require('express')
const router = express.Router()
var hederaRoutes = require('./hedera') // import Hedera routes
var circleRoutes = require('./circle') // import Circle routes

// Middleware
// Add cors
var cors = require('cors')
router.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
)

router.use(express.json()) // for parsing application/json

router.use('/hedera', hederaRoutes) // use Hedera routes for paths starting with /hedera
router.use('/circle', circleRoutes) // use Circle routes for paths starting with /circle

module.exports = router
