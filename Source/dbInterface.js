/**
 *  this module can be replaced with an interface to any database
 *
 *  just implement all the functions attached to "exports"
 */

var DATABASE_URL = "mongodb://flickserver:flickpassword@ds143707.mlab.com:43707/flickblender";
var COLLECTION = "userdata";

var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;

/*
// callback takes boolean parameter = successful post
exports.newPost = function(post, callback) {
    MongoClient.connect(DATABASE_URL, function (err, db) {
        if (err) {
            console.log("error connecting to database for new post: ");
            console.log(err);
            callback(false);
            return;
        }

        db.collection(COLLECTION).insertOne(post, function (err) {
            if (err) {
                console.log("error inserting post:");
                console.log(err);
                callback(false);
                return;
            }

            console.log("successful insert");
            callback(true);
        })
    });
};

// callback takes the post as a parameter
exports.getPost = function (id, callback) {
    MongoClient.connect(DATABASE_URL, function(err, db) {
        if (err) {
            console.log("error connecting to database:");
            console.log(err);
            callback({});
        }

        db.collection(COLLECTION).findOne({ "_id": ObjectID(id) }, function(err, document) {
            if (err) {
                console.log("error in findOne:");
                console.log(err);
                callback({});
            }

            console.log("getPost got this post from database:");
            console.log(document);
            callback(document);
        });
    });
};

// callback has boolean parameter for success
exports.replyToPost = function(id, reply, callback) {
    exports.getPost(id, function(postToReplyTo) {
        if (! postToReplyTo.hasOwnProperty("replies")) {
            console.log("error: didn't get post with reply list");
            console.log(postToReplyTo);
            callback(false);
            return;
        }

        postToReplyTo.replies.push(reply);
        exports.updatePost(postToReplyTo, function(success) {
            callback(success);
        });
    });
};
*/

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

/*
/**
 * @param {number} page
 * @param {string} searchParameters
 * @param {function} callback - has parameter object with "results" list
 *
exports.search = function(page, searchParameters, callback) {
    var RESULT_COUNT = 20;  // TODO: make result count variable
    // TODO: count total posts, so interface can change pages

    MongoClient.connect(DATABASE_URL, function (err, db) {
        if (err) {
            console.log("error connecting to database for post update:");
            console.log(err);
            callback(false);
            return;
        }

        var filter;
        if (searchParameters) {
            filter = {
                title: searchParameters
            };
        }
        else {
            filter = {};
        }
        var options = {
            sort: [['date', 'desc']],
            skip: (page - 1) * RESULT_COUNT,
            limit: RESULT_COUNT  /* ,  TODO: add fields, only what we need for front page?
             fields:{b:1} * /
        };
        console.log("before calling find");

        db.collection(COLLECTION).find(filter, options).toArray(function (err, res) {
            if (err) {
                console.log("error from collection.find");
                callback({ results: [] });
                return;
            }

            // console.log(res);
            callback({ results: res });

            /* I've had trouble with toArray before
             // toArray takes time to work - calls this function before it's done - check if this is a bug in the library
             setTimeout(function () {

             }, 1100);
             * /
        });
    });
};
*/
