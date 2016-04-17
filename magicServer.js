var server = require('http').createServer(),
    url = require('url'),
    express = require('express'),
    app = express(),
    port = 8090;


var startupFolder = process.argv[2];

if (startupFolder) {
    app.use(express.static(startupFolder + '/dist'));
} else {
    app.use(express.static('webapp/dist'));
}

var googleRoute = require('./googleRoute');
app.use('/', googleRoute);

//init the storage
var storage = require('./server/storage-service')();
storage.init();

var webSocketService = require('./server/websocket-service')(server);
var diontService = require('./server/diont-service');

server.on('request', app);
server.listen(port, "0.0.0.0", function () {
    console.log("Magic Mirror Server Starting..");
    // ======
    // Announce our magic mirror service
    // ======
    diontService.announceServer();
});