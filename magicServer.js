var server = require('http').createServer(),
    url = require('url'),
    express = require('express'),
    app = express(),
    port = 8090;


var startupFolder = process.argv[2];
var wifiServer = null;
if (startupFolder) {
    app.use(express.static(startupFolder + '/dist'));
    wifiServer = require('./server/wifi/server')(app);
    wifiServer.startWifiConifg();
} else {
    app.use(express.static('webapp/dist'));
}

//init the storage
var storage = require('./server/storage-service')();
storage.init();

var webSocketService = require('./server/websocket-service')(server);
var diontService = require('./server/diont-service');

server.on('request', app);

function listen(checkWifi) {
    server.listen(port, "0.0.0.0", function () {
        console.log("Magic Mirror Server Starting..");
        // ======
        // Announce our magic mirror service
        // ======
        if (wifiServer && !checkWifi) {
            var interval = setInterval(function() {
                wifiServer.isWifiEnabled(function(enabled) {
                   if (enabled) {
                       server.close();
                       clearInterval(interval);
                       listen(false);
                   }
                });
            }, 3000);
        } else {
            diontService.announceServer();
        }
    });
}
listen(true);

