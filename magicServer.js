var server = require('http').createServer(),
    url = require('url'),
    WebSocketServer = require('ws').Server,
    wss = new WebSocketServer({
        server: server
    }),
    express = require('express'),
    app = express(),
    storage = require('node-persist'),
    _ = require('lodash'),
    diont = require('diont')(),
    port = 8090;
var SYSTEM_USER = "SYSTEM";
var CURRENT_USER = "CURRENT_USER";
var USERS = "USERS";
var MIRROR_NAME = "MIRROR_NAME";
var MESSAGE_TYPES = {
    SAVE_DASHBOARD: "SAVE_DASHBOARD",
    SWITCH_USER: "SWITCH_USER",
    GET_USERS: "GET_USERS",
    RESTART_OFF: "RESTART_OFF",
    CAPTURE_USER: "CAPTURE_USER",
    USER_CAPTURED: "USER_CAPTURED",
    GET_USER_DASHBOARD: "GET_USER_DASHBOARD",
    USER_CAPTURE_FAIL: "USER_CAPTURE_FAIL",
    UPDATE_MIRROR_NAME: "UPDATE_MIRROR_NAME"
};

app.use(express.static('dist'));
storage.initSync();

var currentUser = storage.getItem(CURRENT_USER);
var users = storage.getItem(USERS);
//Set Defaults on first run
var sendReload = true;

if (!users) {
    users = [SYSTEM_USER];
    saveUsers(users);
}
if (!currentUser) {
    currentUser = SYSTEM_USER;
}

function sendNewDashboard(user) {
    sendToAll(getDashboard(user));
}

function sendToAll(stringObj) {
    wss.clients.forEach(function each(client) {
        client.send(stringObj);
    });
}

wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(message) {
		console.log(message);
        message = JSON.parse(message);

        if (message && message.type === MESSAGE_TYPES.SAVE_DASHBOARD) {
            checkUser(message.user);
            storage.setItemSync(message.user, message.dashboard);
            ws.send(getDashboard(message.user));
            sendNewDashboard(message.user);
        } else if (message.type === MESSAGE_TYPES.SWITCH_USER) {
            currentUser = message.user;
            storage.setItemSync(CURRENT_USER, currentUser);
            sendNewDashboard(currentUser);
        } else if (message.type === MESSAGE_TYPES.GET_USERS) {
			var objUsers = {
				type: MESSAGE_TYPES.GET_USERS,
				users: storage.getItem(USERS)
			};
            ws.send(JSON.stringify(objUsers));
        } else if (message.type === MESSAGE_TYPES.RESTART_OFF) {
            sendReload = false;
        } else if (message.type === MESSAGE_TYPES.USER_CAPTURED) {
            sendToAll(JSON.stringify(message));
			if (!_.contains(users, message.user)) {
				users.push(message.user);
				storage.setItem(USERS, users);
			}
        } else if (message.type === MESSAGE_TYPES.CAPTURE_USER) {
            sendToAll(JSON.stringify(message));
        } else if (message.type === MESSAGE_TYPES.GET_USER_DASHBOARD) {
            console.log(JSON.stringify(getDashboard(message.user)));
            ws.send(getDashboard(message.user));
        } else if (message.type === MESSAGE_TYPES.UPDATE_MIRROR_NAME) {
            saveMirrorName(message.name);
        }
    });
    ws.send(getDashboard());
});

function getDashboard(user) {
    if (!user) {
        user = currentUser;
    }
    var dashboard = storage.getItem(user);
    if (!dashboard) {
        dashboard = {};
    }
    dashboard.user = user;
    dashboard.type = "DASHBOARD";
    dashboard.reload = sendReload;
    return JSON.stringify(dashboard);
}

function checkUser(user) {
    var users = storage.getItem(USERS);
    if (!_.includes(users, user)) {
        users.push(user);
        saveUsers(users);
    }
}

function saveUsers(users) {
    storage.setItem(USERS, users);
}

function saveMirrorName(name) {
    storage.setItem(MIRROR_NAME, name);
}

function getMirrorName() {
    return storage.getItem(MIRROR_NAME);
}

function announceServer() {
    var service = {
        name: getMirrorName(),
        port: "8090"
    };
    diont.announceService(service);

    setInterval(function() {
        diont.queryForServices();
    }, 15000);
}

server.on('request', app);
server.listen(port, "0.0.0.0", function() {
    console.log("Magic Mirror Server Starting..");
    // ======
    // Announce our magic mirror service
    // ======
    //announceServer();

});