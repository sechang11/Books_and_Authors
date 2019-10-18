const express = require('express'); // node.js framework that will listen for servers
const graphqlHTTP = require('express-graphql'); // helps express understand gql
const schema = require('./schema/schema');
const mongoose = require('mongoose');   // use mongoose to connect to database


const app = express();


//connect to mlab db
mongoose.connect('mongodb://ninja-ninja:Password1231@ds261828.mlab.com:61828/gql-book-author');
mongoose.connection.once('open', ()=> {                     // ()=> ES6 function
    console.log('connected to database');
});

app.use('/graphql', graphqlHTTP({            // Middleware - see notes above, gql requires schema and query string - endpoint for querying data
    schema,
    graphiql: true
}));

app.listen(4000, () => {
    console.log('Now listening for requests on port 4000');
});