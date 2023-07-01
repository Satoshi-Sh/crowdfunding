var express = require('express')
var hederaRoutes = require('./routes/hedera') // import Hedera routes

var app = express()

app.use(express.json()) // for parsing application/json

app.use('/hedera', hederaRoutes) // use Hedera routes for paths starting with /hedera

app.listen(3000, function () {
  console.log('App listening on port 3000!')
})
