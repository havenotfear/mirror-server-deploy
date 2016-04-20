module.exports = function() {

var diont = require('diont')({
	broadcast: true
});
	
var storageService = require("./storage-service")();

function getDiontService(name) {
return	{
		name: name ? name : storageService.getMirrorName(),
		port: "8090"
	};
}

var service = {
	

    announceServer: function () {
        var service = getDiontService();
        diont.announceService(service);
    },
    restart: function (oldName) {
        service.renounceService(service);
        service.announceServer();
    },
    renounceService: function(oldName) {
        var service = getDiontService(oldName);
        diont.renounceService(service);

    }
};
return service;
};