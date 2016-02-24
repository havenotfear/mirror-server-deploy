var serverProcess;
var grunt = require("grunt");
var git = require("simple-git")();
var exec = require('child_process').exec;

function pullMaster(callback) {
    git.pull(function (err, update) {
        callback(update && update.summary && update.summary.changes == 0);
    });
}

function startServer() {
    serverProcess = require('child_process').spawn('node', ['./magicServer.js']);
    serverProcess.stdout.on('data', function (data) {
        console.log(data.toString());
    });
    serverProcess.stderr.on('data', function (data) {
        console.log(data.toString());
    });
}

function restartServer() {
    serverProcess.kill('SIGINT');
    startServer();
}

startServer();
var interval = setInterval(function () {
    pullMaster(function (isUpToDate) {
        if (!isUpToDate) {
            console.log("Out of date. Restarting Server.");
            restartServer();
        }
    });
}, 15000);



