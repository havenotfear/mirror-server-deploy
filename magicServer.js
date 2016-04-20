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
server.listen(port, "0.0.0.0", function () {
    console.log("Magic Mirror Server Starting.. ");
    // ======
    // Announce our magic mirror service
    // ======
    if (wifiServer) {
        var interval = null;
        function recheckWifi() {
            wifiServer.isWifiEnabled(function(enabled) {
                if (enabled) {
                    console.log("starting websocket server");
                    clearInterval(interval);
			var diontService = require('./server/diont-service')();
        		diontService.announceServer();
                }
            });
        }
        recheckWifi();
        interval = setInterval(recheckWifi, 3000);
    } else {
	var diontService = require('./server/diont-service')();
        console.log("wifi server unaviable");
        diontService.announceServer();
    }
});

