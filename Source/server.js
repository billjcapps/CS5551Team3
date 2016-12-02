/**
 * node-js server
 */

var PORT = 63342;  // webstorm default is 63342, this is registered for google oauth
                   // start server from command line before starting webstorm

var SAVE_URL = "/save";
var LOAD_URL = "/load";

var StatusEnum = Object.freeze({
    SUCCESS: 200,
    BAD_REQUEST: 400,
    CONFLICT: 409,
    SERVER_ERROR: 500
});

var express = require('express');

// custom modules
var databaseInterface = require("./dbInterface.js");

var expressApplication = express();

/**
 *  save data to database
 *  post object with "id" attribute and "data" attribute
 */
expressApplication.post(SAVE_URL, function (req, res) {
    var id = req.body.id;
    var dataToSave = req.body.data;

    if (id == undefined || dataToSave == undefined) {
        res.status(StatusEnum.BAD_REQUEST);
        res.write("id and data required");
        res.end();
        return;
    }

    console.log("save id: " + id);
    console.log("save data:\n");
    console.log(dataToSave);
    databaseInterface.save(id, dataToSave, function(result) {
        res.write(JSON.stringify(result));
        res.end();
    });
});

// static files served
expressApplication.use(express.static("public"));

var server = expressApplication.listen(PORT, function () {
    console.log("server listening at http://localhost:%s", PORT);
});
