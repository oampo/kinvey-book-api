var MongoClient = require('mongodb').MongoClient;

var db = null;

var connect = function(callback) {
    if (db) {
        callback(null, db);
        return;
    }

    MongoClient.connect('mongodb://localhost/kinvey', function(err, database) {
        if (err) {
            callback(err);
            return;
        }

        db = database;
        callback(null, db);
    });
};

var disconnect = function() {
    db.close();
};

var get = function() {
    if (db === null) {
        throw new Error('You need to connect to your database before getting it');
    }
    return db;
};

exports.connect = connect;
exports.disconnect = disconnect;
exports.get = get;

