//importing the required libraries
const express = require('express');
const {ApolloServer} = require('@apollo/server');
//expressMiddleware is provided by Apollo Server 
//to help integrate Apollo Server with an Express application.
const {expressMiddleware} = require('@apollo/server/express4');
const bodyParser = require('body-parser');
const cors = require('cors');
//axios is a popular JavaScript library used for making HTTP requests 
const axios = require('axios')
const mysql = require('mysql2'); // Import mysql2 package
const { executeQuery } = require('./dbConnection');

//Write the entire code in startServer function
async function startServer(){

  const app = express();

  //type definition/schema
  const typeDefs = `
  type Post {
    id: ID!
    title: String!
    content: String!
  }

  type Query {
    getPosts: [Post]
    getPost(id: ID!): Post
  }

  type Mutation {
    createPost(title: String!, content: String!): Post
  }
`;

  // Resolvers
  const resolvers = {
  Query: {
    getPosts: async () => {
      try {
        const rows= await executeQuery('SELECT * FROM posts');
        return [...rows]; // Return an array of post objects
      } catch (error) {
        throw error;
      }
    },
    getPost: async (_, { id }) => {
      try {
        const [rows] = await executeQuery(`SELECT * FROM posts WHERE id = ${id}`);
        return rows; // Return an array of post objects
      } catch (error) {
        throw error;
      }
    },
  },
  Mutation: {
    createPost: async (_, { title, content }) => {
      try {
        const result = await executeQuery('INSERT INTO posts (title, content) VALUES (?, ?)', [title, content]);
        //console.log(result)
        const newPostId = result.insertId;
        console.log(newPostId);
        const [newPost] = await executeQuery('SELECT * FROM posts WHERE id = ?', [newPostId]);

        if(newPost.length===0){
          throw new Error('Failed to fetch the newly created post');
    }


      return newPost;
      } catch (error) {
        throw error;
      }
                
    },
  },
};


  //Creating an instance of ApolloSever, which simplies the process of building a GraphQL server, 
  //allowing you to define your schema, resolvers, and other configurations.
  const server = new ApolloServer({typeDefs, resolvers});

  app.use(bodyParser.json());
  await server.start();

  app.use('/graphql', expressMiddleware(server));

  app.listen(8008, (err)=> {
    if(err) throw err;
    console.log('Server started on PORT 8008')
  });
}

//calling the server
startServer();