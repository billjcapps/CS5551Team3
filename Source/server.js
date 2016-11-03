/**
 * node-js server
 */

var PORT = 63342;  // webstorm default is 63342, this is registered for google oauth

var express = require('express');

var expressApplication = express();

// static files served
expressApplication.use(express.static("public"));

var server = expressApplication.listen(PORT, function () {
    console.log("server listening at http://localhost:%s", PORT);
});
