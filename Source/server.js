/**
 * node-js server
 */

var PORT = 8080;  // webstorm default is 63342, this is registered for Bill's google oauth
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
var bodyParser = require("body-parser");
var cors = require("cors");

// custom modules
var databaseInterface = require("./dbInterface.js");

var expressApplication = express();

expressApplication.use(cors());
expressApplication.use(bodyParser.json({limit: '50mb'}));
expressApplication.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

/**
 *  save data to database
 *  post object with "id" attribute and "data" attribute
 */
expressApplication.post(SAVE_URL, function (req, res) {
    console.log(req.body);
    var id = req.body.id;
    var dataToSave = req.body.data;

    if (id == undefined || dataToSave == undefined) {
        res.status(StatusEnum.BAD_REQUEST);
        res.write("id and data required");
        res.end();
        return;
    }

    console.log("save id: " + id);
    console.log("save data:");
    console.log(dataToSave);
    databaseInterface.save(id, dataToSave, function(success) {
        if (success) {
            res.write("success");
            res.end();
            return;
        }
        res.status(StatusEnum.SERVER_ERROR);
        res.write("error saving data");
        res.end();
    });
});

/**
 *  load data from database
 *  post object with "id" attribute
 */
expressApplication.post(LOAD_URL, function (req, res) {
    console.log("received load request from client:");
    console.log(req.body);
    var id = req.body.id;

    if (id == undefined) {
        res.status(StatusEnum.BAD_REQUEST);
        res.write("id required");
        res.end();
        return;
    }

    console.log("load id: " + id);
    databaseInterface.load(id, function(response) {
        res.contentType('application/json');
        res.write(JSON.stringify(response));
        res.end();
    });
});

// static files served
expressApplication.use(express.static("public"));

var server = expressApplication.listen(PORT, function () {
    console.log("server listening at http://localhost:%s", PORT);
});
