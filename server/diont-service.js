var diont = null;

module.exports = function() {
	if (!diont) {
        try {
            console.log("Diont not loaded yet. Loading..");
            diont = require('diont')({
                broadcast: true
            });
        } catch (e) {
            console.log("Could not load diont");
        }
    }

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