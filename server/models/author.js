const mongoose = require('mongoose');
const Schema = mongoose.Schema;   // sends schema model to database

const authorSchema = new Schema({     //  creates a new mongoose.schema object to send to database // diff datatypes // mongodb automatically creates an id for each object
    name: String,
    age: Number
});


module.exports = mongoose.model('Author', authorSchema);    // model = collection called Book, that uses bookSchema