var serverProcess;
var startupFolder = process.argv[2];
var grunt = require("grunt");
var git;
if (startupFolder) {
    git = require("simple-git")(startupFolder);
} else {
    git = require("simple-git")();
}

var fork = require('child_process').fork;

function pullMaster(callback) {
    console.log("Checking version.");
    git.pull(function (err, update) {
        callback(err != null || update && update.summary && update.summary.changes == 0);
    });
}

function startServer() {
    if (startupFolder) {
        serverProcess = fork(__dirname + '/magicServer.js', [startupFolder]);
    } else {
        serverProcess = fork(__dirname + '/magicServer.js');
    }
    serverProcess.on('message', function (data) {
        if (data.toString() == "RESTART") {
            restartServer();
        }
        console.log(data.toString());
    });
    serverProcess.on('error', function (data) {
        console.log(data.toString());
    });
}

function restartServer() {
    console.log("Restarting Server");
    serverProcess.kill('SIGINT');
    startServer();
}

startServer();

if (startupFolder) {
    setTimeout(function() {
        var childProcess = require('child_process');
        childProcess.exec('chromium-browser --incognito --kiosk "http://localhost:8090"');
    }, 100);
}

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



