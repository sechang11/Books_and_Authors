const mongoose = require('mongoose');
const Schema = mongoose.Schema;   // sends schema model to database

const bookSchema = new Schema({     //  creates a new mongoose.schema object to send to database // diff datatypes // mongodb automatically creates an id for each object
    name: String,
    genre: String,
    authorId: String
});


module.exports = mongoose.model('Book', bookSchema);    // model = collection called Book, that uses bookSchema