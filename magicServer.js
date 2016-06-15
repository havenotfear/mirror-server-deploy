var server = require('http').createServer(),
    url = require('url'),
    express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    port = 8090;


var startupFolder = process.argv[2];
var wifiServer = null;

app.use(bodyParser.json());
app.use(function(req, resp, next) {
	resp.header("Access-Control-Allow-Origin", "*");
	resp.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");        
	next();
});
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


server.on('request', app);

if (wifiServer) {
    wifiServer.isWifiEnabled(function(enabled) {
        listen(enabled);
    });
} else {
    listen(true);
}

function restart(server) {
    setTimeout(function(){
        console.log("Sending restart");
        process.send("RESTART");
        server.close();
    }, 5000);
}

function recheckWifi(interval, server) {
    console.log("checking wifi");
    wifiServer.isWifiEnabled(function(enabled) {
        if (enabled) {
            webSocketService.sendRestart();
            startDiont();
            clearInterval(interval);
        }
    });
}

function startDiont() {
    console.log("starting diont")
    var diontService = require('./server/diont-service')();
    diontService.announceServer();
}

function listen(checkWifi) {
    server.listen(port, "0.0.0.0", function () {
        console.log("Magic Mirror Server Starting.. " + checkWifi);
        if (wifiServer && !checkWifi) {
            var interval = setInterval(function() {
                recheckWifi(interval, server);
            }, 3000);
            recheckWifi(interval, server);
        } else {
            startDiont();
        }
    });
}

