var constants = require('./constants');
var _ = require('lodash');
var diontService = require('./diont-service');
var storageService;
var wss;
var sendReload = true;

function saveDashboard(message) {
    storageService.saveDashboard(message.user, message.dashboard);
    storageService.checkUser(message.user);
    if (message.user === storageService.currentUser) {
        sendNewDashboard(message.user);
    }
}

function sendNewDashboard(user) {
    sendToAll(getDashboard(user));
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
        user = storageService.currentUser;
    }
    var dashboard = storageService.getDashboard(user);
    if (!dashboard) {
        dashboard = {};
    }
    dashboard.user = user;
    dashboard.type = "DASHBOARD";
    dashboard.reload = sendReload;
    return JSON.stringify(dashboard);
}
function switchUser(user) {
    storageService.switchUser(user);
    sendNewDashboard(user);
}

function saveMirrorName(name) {
    var oldName = storageService.getMirrorName();
    storageService.saveMirrorName(name);
    diontService.restart(oldName);
}

var handleService = {
    sendDashboard: function(ws) {
        ws.send(getDashboard());
    },
    handleMessage: function(message, ws) {
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
        } else if (message.type === constants.MESSAGE_TYPES.UPDATE_MIRROR_NAME) {
            saveMirrorName(message.name);
        } else if (message.type === constants.MESSAGE_TYPES.DELETE_PROFILE) {
            storageService.deleteUser(message.user);
            switchUser(constants.SYSTEM_USER);
        }
    }
};

module.exports = function (server, webSocketServer) {
    storageService = require('./storage-service')();
    wss = webSocketServer;
    return handleService;
};