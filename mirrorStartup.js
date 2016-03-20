var serverProcess;
var startupFolder = process.argv[2];
var grunt = require("grunt");
var git = require("simple-git")(startupFolder);
var fork = require('child_process').fork;

function pullMaster(callback) {
    console.log("Checking version.");
    git.pull(function (err, update) {
        callback(update && update.summary && update.summary.changes == 0);
    });
}

function startServer() {
    serverProcess = fork(__dirname + '/magicServer.js', [startupFolder]);
    serverProcess.on('message', function (data) {
        console.log(data.toString());
    });
    serverProcess.on('error', function (data) {
        console.log(data.toString());
    });
}

function restartServer() {
    serverProcess.kill('SIGINT');
    startServer();
}

startServer();

setTimeout(function() {
	var childProcess = require('child_process'); 
	childProcess.exec('start chrome --kiosk localhost:8090');
}, 100)

var interval = setInterval(function () {
    pullMaster(function (isUpToDate) {
        if (!isUpToDate) {
            console.log("Out of date. Restarting Server.");
            restartServer();
        } else {
            console.log("Up to date.");
        }
    });
}, 15000);



