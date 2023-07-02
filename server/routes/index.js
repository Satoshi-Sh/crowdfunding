const express = require('express')
const router = express.Router()
var hederaRoutes = require('./hedera') // import Hedera routes

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

module.exports = router
