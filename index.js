var express = require('express');
var bodyParser = require('body-parser');

var ObjectId = require('mongodb').ObjectId;

var db = require('./db');
var book = require('./book');

var app = express();

var api = express.Router();

api.use(bodyParser.json());

api.post('/book', function(req, res) {
    if (!req.body || !req.body.author || !req.body.title) {
        var error = new Error();
        error.status = 400;
        error.message = "Missing information in request body";
        throw error;
    }
    book.create(req.body, function(err, book) {
        if (err) {
            var error = new Error();
            error.status = 500;
            error.message = "Internal server error";
            throw error;
        }

        res.status(201).location('/book/' + book._id).send();
    });
});

api.get('/book/:id', function(req, res) {
    var filter = {
        _id: new ObjectId(req.params.id)
    };
    console.log(filter);
    book.read(filter, function(err, book) {
        if (err) {
            var error = new Error();
            error.status = 500;
            error.message = "Internal server error";
            throw error;
        }

        if (!book) {
            var error = new Error();
            error.status = 404;
            error.message = "Book not found";
            throw error;
        }


        res.status(200).json(book);
    });
});

api.put('/book/:id', function(req, res) {
    // TODO: Check that the id from req.params is the same as the id from
    // req.body
    var theBook = req.body;
    theBook._id = new ObjectId(req.params.id);
    book.update(theBook, function(err) {
        if (err) {
            console.log(err);
            var error = new Error();
            error.status = 500;
            error.message = "Internal server error";
            throw error;
        }

        res.status(200).location('/api/book/' + theBook._id).send();
    });
});

api.delete('/book/:id', function(req, res) {
    // TODO: Check that the id from req.params is the same as the id from
    // req.body
    book.remove({
        _id: new ObjectId(req.params.id)
    }, function(err) {
        if (err) {
            console.log(err);
            var error = new Error();
            error.status = 500;
            error.message = "Internal server error";
            throw error;
        }

        res.status(200).send();
    });
});


app.use('/api', api);

app.use(function(err, req, res, next) {
    if (err.status) {
        return res.status(err.status).send(err.message);
    }
    next(err);
});

db.connect(function() {
    app.listen(process.env.PORT || 8080, function() {
        console.log('Listening on http://localhost:' + (process.env.PORT || 8080));
    });
});

