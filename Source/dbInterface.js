/**
 *  this module can be replaced with an interface to any database
 *
 *  just implement all the functions attached to "exports"
 */

var DATABASE_URL = "mongodb://flickserver:flickpassword@ds143707.mlab.com:43707/flickblender";
var COLLECTION = "userdata";

var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;

// callback takes the post as a parameter
exports.load = function (id, callback) {
    MongoClient.connect(DATABASE_URL, function(err, db) {
        if (err) {
            console.log("error connecting to database:");
            console.log(err);
            callback({ franchises: [] });
        }

        db.collection(COLLECTION).findOne({ "id": id }, function(err, document) {
            if (err) {
                console.log("error in findOne:");
                console.log(err);
                callback({ franchises: [] });
            }

            console.log("getPost got this post from database:");
            console.log(document);
            callback(document.data);
        });
    });
};

// callback has boolean parameter for success
exports.save = function (id, dataToSave, callback) {
    MongoClient.connect(DATABASE_URL, function (err, db) {
        if (err) {
            console.log("error connecting to database for post update:");
            console.log(err);
            callback(false);
            return;
        }

        console.log("ready to call upsert");

        db.collection(COLLECTION).updateOne({id: id}, {id:id, data:dataToSave}, {upsert:true, w: 1}, function (err) {
            if (err) {
                console.log("error updating post:");
                console.log(err);
                callback(false);
                return;
            }

            console.log("successful data update");
            callback(true);
        });
    });
};
