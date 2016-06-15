module.exports = function (server) {
    var WebSocketServer = require('ws').Server;
    var wss = new WebSocketServer({
        server: server
    });
    var messageHandler = require("./message-handler-service")(server, wss);
    wss.on('connection', function connection(ws) {
        ws.on('message', function incoming(message) {
            messageHandler.handleMessage(message, ws);
        });
        messageHandler.sendDashboard(ws);
    });
    return {
        sendRestart: function() {
            messageHandler.sendRestart();
        }
    };
};

