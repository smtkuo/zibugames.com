const express = require("express")
const fs = require('fs')
const https = require('https')
const http = require('http')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const logger = require('morgan')
const path = require('path')
const bodyParser = require('body-parser')
require('dotenv').config();

var privateKey = fs.readFileSync('../ssl.key').toString()
var certificate = fs.readFileSync('../ssl.cert').toString()
var ca = fs.readFileSync('../ssl.ca').toString()

var options = {
    key: privateKey,
    cert: certificate
  };
var serverPort = 50010;
var httpServerPort = 50011;
const app = express()
var server = https.createServer(options, app);
var httpserver = http.createServer(app);
var io = require('socket.io')(server,{
    allowEIO3: true,
    cors: { origin: '*' } 
});

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.use(logger('dev'))
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
	extended: false
}))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.use(require('./router/index'))

// START ^^
server.listen(serverPort, function() {
    console.log('server up and running at %s port', serverPort);
});
httpserver.listen(httpServerPort, function() {
    console.log('http server up and running at %s port', httpServerPort);
});