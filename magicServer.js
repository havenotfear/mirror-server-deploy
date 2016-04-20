var server = require('http').createServer(),
    url = require('url'),
    express = require('express'),
    app = express(),
    bodyParser = require("body-parser"),
    port = 8090;


var startupFolder = process.argv[2];
var wifiServer = null;
app.use(bodyParser.json());
app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
	next();
});
 

if (startupFolder) {
    app.use(express.static(startupFolder + '/dist'));
    wifiServer = require('./server/wifi/server')(app);
    wifiServer.startWifiConifg();
} else {
    app.use(express.static('webapp/dist'));
}

var googleRoute = require('./googleRoute');
app.use('/', googleRoute);

//init the storage
var storage = require('./server/storage-service')();
storage.init();

var webSocketService = require('./server/websocket-service')(server);



function announceServer() {
	try {
		var diontService = require('./server/diont-service')();
		var id = diontService.announceServer();
		console.log("ID: " + id);		
		if (!id) {
			setTimeout(function() {announceServer();}, 5000);
			console.log("retrying");		
		}
	} catch (ex) {
		setTimeout(announceServer, 5000);
	}
}

server.on('request', app);
server.listen(port, "0.0.0.0", function () {
    console.log("Magic Mirror Server Starting..");
    // ======
    // Announce our magic mirror service
    // ======
    //announceServer();
});