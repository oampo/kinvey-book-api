var db = require('./db');
var book = require('./book');

db.connect(function() {
    book.create({
        title: 'Infinite Jest',
        author: 'David Foster Wallace'
    }, function(err, theBook) {
        if (err) {
            throw err;
        }
        console.log('Book added');
        theBook.title = 'The Broom of the System';
        book.update(theBook, function(err) {
            console.log('Book updated');

            book.read({
                author: 'David Foster Wallace'
            }, function(err, theBook) {
                console.log('Book read', theBook);
                book.remove(theBook, function() {
                    console.log('Book deleted');
                });
            });
        });
    });
});
