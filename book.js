var db = require('./db');
var ObjectId = require('mongodb').ObjectId;

var create = function(book, callback) {
    db.get().collection('books').insertOne(book, function(err, result) {
        if (err) {
            if (callback) {
                callback(err);
            }
            return;
        }

        book._id = result.insertedId;
        if (callback) {
            callback(null, book);
        }
    });
};

var update = function(book, callback) {
    var filter = {
        _id: new ObjectId(book._id)
    };
    db.get().collection('books').updateOne(filter, book, function(err, result) {
        if (err) {
            if (callback) {
                callback(err);
            }
            return;
        }

        if (callback) {
            callback();
        }
    });
};

var read = function(book, callback) {
    db.get()
        .collection('books')
        .find(book)
        .limit(1)
        .next(function(err, result) {
            if (err) {
                if (callback) {
                    callback(err);
                }
                return;
            }

            if (callback) {
                callback(null, result);
            }
        });
};

var remove = function(book, callback) {
    var filter = {
        _id: new ObjectId(book._id),
    };

    db.get().collection('books').findOneAndDelete(filter, function(err) {
        if (err) {
            if (callback) {
                callback(err);
            }
            return;
        }

        if (callback) {
            callback();
        }
    });
};


exports.create = create;
exports.read = read;
exports.update = update;
exports.remove = remove;
