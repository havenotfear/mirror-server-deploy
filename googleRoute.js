var express = require('express');
var router = express.Router();
var clientId = "152667895264-jub257fqmqmldk84kabmrg8267ja4krm.apps.googleusercontent.com";
var clientSecret = "uE-DywAVcAAGUWQ1Sirzg1xM";
var grantType = "authorization_code";
var request = require('request');
var authUrl = "https://www.googleapis.com/oauth2/v4/token";
var redirectUrl = "http://localhost:8100";

router.post('/auth/google', function (req, res, next) {
    var code = req.params.code;
    request.get({
            url: authUrl,
            qs: {
                grant_type: grantType,
                client_secret: clientSecret,
                client_id: clientId,
                code: code,
                redirect_uri: redirectUrl
            }
        },
        function (error, response, body) {
            var refreshToken = body.refresh_token;
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify({ refresh_token: refreshToken }));
        });
});


module.exports = router;
