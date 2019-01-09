const hapi = require('hapi');
const http = require('http');
const mongoose = require('mongoose');
const Painting = require('./models/Painting')
//const {ApolloServer } =require('apollo-server-hapi')
const schema = require('./graphql/schema');
const { ApolloServer } = require('apollo-server-express');
const express = require('express');


const Inert = require('inert')
const Vision = require('vision')
const HapiSwagger = require('hapi-swagger')
const Pack = require('./package')


mongoose.connect('mongodb://birandkoray:calipso90@ds251284.mlab.com:51284/salmandoo',
	{ useNewUrlParser : true});

mongoose.connection.once('open' , () => {
	console.log('connected to DB')
})

const PORT = 4000;
const app = express();
const server = new ApolloServer({ schema});

server.applyMiddleware({app})

const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

// ⚠️ Pay attention to the fact that we are calling `listen` on the http server variable, and not on `app`.
httpServer.listen(PORT, () => {
  console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`)
  console.log(`🚀 Subscriptions ready at ws://localhost:${PORT}${server.subscriptionsPath}`)

})