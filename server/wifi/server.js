var async = require("async"),
    wifi_manager = require("./wifi_manager")(),
    dependency_manager = require("./dependency_manager")(),
    iwlist     = require("./iwlist"),
    config = require("./config.json");
var exec    = require("child_process").exec;
// Helper function to log errors and send a generic status "SUCCESS"
// message to the caller
function log_error_send_success_with(success_obj, error, response) {
    if (error) {
        console.log("ERROR: " + error);
        response.send({status: "ERROR", error: error});
    } else {
        success_obj = success_obj || {};
        success_obj["status"] = "SUCCESS";
        response.send(success_obj);
    }
    response.end();
}

module.exports = function (app) {
    /*****************************************************************************\
     1. Check for dependencies
     2. Check to see if we are connected to a wifi AP
     3. If connected to a wifi, do nothing -> exit
     4. Convert RPI to act as a AP (with a configurable SSID)
     6. Once the RPI is successfully configured, reset it to act as a wifi
     device (not AP anymore), and setup its wifi network based on what the
     user picked.
     7. At this stage, the RPI is named, and has a valid wifi connection which
     its bound to, reboot the pi and re-run this script on startup.
     \*****************************************************************************/
    app.get("/api/rescan_wifi", function (request, response) {
	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");        
	console.log("Server got /rescan_wifi");
        iwlist(function (error, result) {
            log_error_send_success_with(result[0], error, response);
        });
    });

    app.post("/api/enable_wifi", function (request, response) {
	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
	
	console.log("Enable Wifi: " + JSON.stringify(request.body));
        var conn_info = {
            wifi_ssid: request.body.ssid,
            wifi_passcode: request.body.passphrase
        };
        // TODO: If wifi did not come up correctly, it should fail
        // currently we ignore ifup failures.
        wifi_manager.enable_wifi_mode(conn_info, function (error) {
            if (error) {
                console.log("Enable Wifi ERROR: " + error);
                console.log("Attempt to re-enable AP mode");
                wifi_manager.enable_ap_mode(config.access_point.ssid, function (error) {
                    console.log("... AP mode reset");
                });
                response.redirect("/");
            }
            // Success! - exit
            console.log("Wifi Enabled!");
        });
    });

    return {
        startWifiConifg: function() {
            async.series([
                // 1. Check if we have the required dependencies installed
                function test_deps(next_step) {
                    dependency_manager.check_deps({
                        "binaries": ["dhcpcd", "hostapd", "iw", "dnsmasq"]
                    }, function (error) {
                        if (error) console.log(" * Dependency error, did you run `sudo npm run-script provision`?");
                        next_step(error);
                    });
                },

                // 2. Check if wifi is enabled / connected
                function test_is_wifi_enabled(next_step) {
                    wifi_manager.is_wifi_enabled(function (error, result_ip) {
                        // console.log(result_ip)
                        if (result_ip) {
                            console.log("\nWifi is enabled, and IP " + result_ip + " assigned");
                            return next_step("EXIT");
                        } else {
                            console.log("\nWifi is not enabled, Enabling AP for self-configure");
                        }
                        next_step(error);
                    });
                },

                // 3. Turn RPI into an access point
                function enable_rpi_ap(next_step) {
                    wifi_manager.enable_ap_mode(config.access_point.ssid, function (error) {
                        if (error) {
                            console.log("... AP Enable ERROR: " + error);
                        } else {
                            console.log("... AP Enable Success!");
                        }
                        next_step(error);
                    });
                }
            ], function (error) {
                if(error === "EXIT") {
                    return;
                }
                if (error) {
                    console.log("ERROR: " + error);
                }
            });
        },
        isWifiEnabled: function(callback) {

            wifi_manager.is_wifi_enabled(function (error, result_ip) {
                // console.log(result_ip)
                if (result_ip) {
                    callback(true);
                } else {
                    callback(false);
                }

            });
        }
    };
};
