const graphql = require('graphql');
const _ = require('lodash');            // helps locate using index?
const Book = require ('../models/book');
const Author = require ('../models/author');

const { 
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLID,
    GraphQLInt,
    GraphQLList, 
    } = graphql; // grabs GraphQLObjectType object type from graphql + gqlstring + gqlschema from gqllib



// dummy data for testing - without a database
/*
var books = [ 
    { name: 'Name of the Wind', genre: 'Fantasy', id: '1', authorId: '1' },    //authorid has to be the same as id in author array
    { name: 'The Final Empire', genre: 'Fantasy', id: '2', authorId: '2' },
    { name: 'The Long Earth', genre: 'Sci-Fi', id: '3',  authorId: '3' },
    { name: 'The Hero of Ages', genre: 'Fantasy', id: '4', authorId: '2' },  
    { name: 'The Colour of Magic', genre: 'Fantasy', id: '5', authorId: '3' },
    { name: 'The Light Fantastic', genre: 'Sci-Fi', id: '6',  authorId: '3' },
];

var authors = [ 
    { name: 'Patrick Rothfus', age: 45, id: '1' },
    { name: 'Brandon Sanderson', age: 42, id: '2' },
    { name: 'Terry Pratchett', age: 66, id: '3' },
];
*/
// dummy data end


// Every book has an author
// Every author has a collection of books
// Two way relational property

const BookType = new GraphQLObjectType({
    name: 'Book',           
    fields: () => ({        // ES6 function that wraps the object in a function, so it won't look for definition until function fires
        id: { type: GraphQLID },        // GraphQLID can now take "1", and 1 as an input. String takes "1" only. Both are strings in JS.
        name: { type: GraphQLString },
        genre: { type: GraphQLString },
        author: {                       // why author and not authorId?
            type: AuthorType,
            resolve(parent, args){      // resolve - to find the exact relational object query, 
                //console.log(parent)    // parent passes all the parent data in of the Parent object (BookType), (name, genre, id, authorId)
                // lodash for dummy data - 
                // return _.find(authors, { id: parent.authorId });    // find finds where the match is true

                return Author.findById(parent.authorId);    //findbyId vs find
            }
        }
    })
});

const AuthorType = new GraphQLObjectType({
    name: 'Author',           
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
        books: {
            type: new GraphQLList(BookType),   // new type to grab all books
            resolve(parent, args){
                //return _.filter(books, { authorId: parent.id });    // filter returns only matching results (authorId == parent.id) of the array
                return Book.find({ authorId: parent.id });     //findbyId vs find
            }
        }
    })
});

// 3 Purposes:
// Define Types
// Define Relationships between types (only 1 here)
// Define Root Queries

const RootQuery = new GraphQLObjectType({           //  - How we initially jump into the graph
    name: 'RootQueryType',
    fields: {
        book: {
            type: BookType,
            args: { id: { type: GraphQLID }},  // type pecified above in BookType
            // book (id: '123' ) {
            //    name
            //    genre
            // }
            resolve(parent, args){
                // code to get data from db / other source
                //return _.find(books, { id: args.id });

                return Book.findById(args.id);
            }
        },
        // still under fields:
        author: {
            type: AuthorType,
            args: { id: { type: GraphQLID }},
            resolve(parents, args){
                //return _.find(authors, {id: args.id });

                return Author.findById(args.id);
            }
        },
        // still under fields:
        books: {
            type: new GraphQLList(BookType),        // Query to return all books array. Necessary?
            resolve(parent, args){
                //return books

                return Book.find({});
            }
        },
        // still under fields:
        authors: {
            type: new GraphQLList(AuthorType),        // Query to return all authors array. Necessary?
            resolve(parent, args){
                //return authors

                return Author.find({});
            }
        },

    }
});


const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addAuthor: {
            type: AuthorType,
            args: {
                name: { type: GraphQLString },
                age: { type: GraphQLInt}
            },
            resolve(parent, args){
                let author = new Author({
                    name: args.name,
                    age: args.age
                });
                return author.save(); // mongoose knows how to save it using author.save
            }
        },
        addBook: {
            type: BookType,
            args: {
                name: { type: GraphQLString },
                genre: { type: GraphQLString },
                aurthorId: { type: GraphQLID }
            },
            resolve(parent, args){
                let book = new Book({
                    name: args.name,
                    genre: args.genre,
                    authorId: args.authorId
                });
                return book.save(); // mongoose knows how to save it using author.save
            }
        },
    }
})







module.exports = new GraphQLSchema({            // New Schema object from gqllib
    query: RootQuery,            //RootQuery is defined. RootQuery uses BookType. 
    mutation: Mutation
})



/*  Queries
{
    book(id: 3){
        name
        genre
    }
}

{
    books{
        name
        genre
    }
}

{
    authors{
        name
        age
        books{
            name
        }
    }
}

{
    authors{
      name
        books{
          name
            author{
              name
              books{
                name
                author{
                  age
                }
              }
            }

        }
    }
}
*/