var constants = require('./constants');
var _ = require('lodash');
var fs = require('fs-extra');
var storageService;
var wss;
var sendReload = true;
var exec = require('child_process').exec;

function saveDashboard(message) {
    storageService.saveDashboard(message.user, message.dashboard);
    storageService.checkUser(message.user);
    console.log("message user: " + message.user);
    console.log("currentUser: " + storageService.getCurrentUser());
    if (message.user === storageService.getCurrentUser()) {
        sendNewDashboard(message.user);
    }
}

function execute(command, callback) {
    exec(command, function (error, stdout, stderr) {
        callback(stdout);
    });
}

function sendNewDashboard(user) {
    sendToAll(getDashboard(user));
}

function rotateScreen(rotation) {
    if (storageService.getRotation() !== rotation) {
        var direction = "landscape";
        if (rotation === 0) {
            direction = "portrait";
        }
        fs.copySync('/home/pi/mirror-server-deploy/server/assets/boot/' + direction + '.config.txt', '/boot/config.txt');
        storageService.setRotation(rotation);
        execute('shutdown -r now', function (callback) {
            console.log(callback);
        });
    }

}

function getUsers(message, ws) {
    var objUsers = {
        type: constants.MESSAGE_TYPES.GET_USERS,
        users: storageService.getUsers()
    };
    ws.send(JSON.stringify(objUsers));
}

function restartOff() {
    sendReload = false;
}

function sendToAll(stringObj) {
    wss.clients.forEach(function each(client) {
        client.send(stringObj);
    });
}

function getDashboard(user) {
    if (!user) {
        user = storageService.getCurrentUser();
    }
    var dashboard = storageService.getDashboard(user);
    if (!dashboard) {
        dashboard = {};
    }
    dashboard.user = user;
    dashboard.type = "DASHBOARD";
    dashboard.reload = sendReload;
    dashboard.name = storageService.getMirrorName();
    dashboard.rotation = storageService.getRotation();
    return JSON.stringify(dashboard);
}
function switchUser(user) {
    storageService.switchUser(user);
    sendNewDashboard(user);
}

function saveMirrorName(name, rotation) {
    var diontService = require('./diont-service')();
    var oldName = storageService.getMirrorName();
    storageService.saveMirrorName(name);
    diontService.restart(oldName);
    rotateScreen(rotation);
}

var handleService = {
    sendDashboard: function (ws) {
        ws.send(getDashboard());
    },
    sendRestart: function () {
        sendReload = true;
        wss.clients.forEach(function each(client) {
            handleService.sendDashboard(client);
        });
    },
    handleMessage: function (message, ws) {
        console.log(message);
        message = JSON.parse(message);
        if (message && message.type === constants.MESSAGE_TYPES.SAVE_DASHBOARD) {
            saveDashboard(message)
        } else if (message.type === constants.MESSAGE_TYPES.SWITCH_USER) {
            switchUser(message.user);
        } else if (message.type === constants.MESSAGE_TYPES.GET_USERS) {
            getUsers(message, ws);
        } else if (message.type === constants.MESSAGE_TYPES.RESTART_OFF) {
            restartOff();
        } else if (message.type === constants.MESSAGE_TYPES.USER_CAPTURED) {
            sendToAll(JSON.stringify(message));
            storageService.userCaptured(message.user);
        } else if (message.type === constants.MESSAGE_TYPES.CAPTURE_USER) {
            sendToAll(JSON.stringify(message));
        } else if (message.type === constants.MESSAGE_TYPES.GET_USER_DASHBOARD) {
            console.log(JSON.stringify(getDashboard(message.user)));
            ws.send(getDashboard(message.user));
        } else if (message.type === constants.MESSAGE_TYPES.UPDATE_MIRROR) {
            saveMirrorName(message.name, message.rotation);
        } else if (message.type === constants.MESSAGE_TYPES.DELETE_PROFILE) {
            storageService.deleteUser(message.user);
            switchUser(constants.SYSTEM_USER);
        } else if (message.type === constants.MESSAGE_TYPES.USER_CAPTURE_FAIL) {
            sendToAll(JSON.stringify(message));
        }

    }
};

module.exports = function (server, webSocketServer) {
    storageService = require('./storage-service')();
    wss = webSocketServer;
    return handleService;
};