const Hapi = require('@hapi/hapi');
const mongoose = require('mongoose');
const { ApolloServer, gql } = require('apollo-server');
const Painting = require('./models/Painting');

/* swagger section */
const Inert = require('inert');
const Vision = require('vision');
const HapiSwagger = require('hapi-swagger');
const Pack = require('./package');

mongoose.connect('mongodb://indrek:test@ds231090.mlab.com:31090/powerful-api');

mongoose.connection.once('open', () => {
	console.log('connected to database');
});

// The GraphQL schema
const typeDefs = gql`
  type Painting {
    id: String
    name: String
    url: String
    technique: String
  }
  type Query {
	paintings: [Painting]
	paintingsById(id: ID!): Painting
  }
`;

// A map of functions which return data for the schema.
const resolvers = {
	Query: {
		paintings: () => Painting.find(),
		paintingsById: (obj, args) => Painting.findById(args.id)
	},
};

async function StartServer() {
	const server = new ApolloServer({ typeDefs, resolvers });

	const app = new Hapi.server({
		port: 3000
	});

	server.listen().then(({ url }) => {
		console.log(`🚀 Server ready at ${url}`);
	});

	await app.register([
		Inert,
		Vision,
		{
			plugin: HapiSwagger,
			options: {
				info: {
					title: 'Paintings API Documentation',
					version: Pack.version
				}
			}
		}
	]);

	app.route([
		{
			method: 'GET',
			path: '/api/v1/paintings',
			config: {
				description: 'Get all the paintings',
				tags: ['api', 'v1', 'painting']
			},
			handler: (req, reply) => {
				return Painting.find();
			}
		},
		{
			method: 'POST',
			path: '/api/v1/paintings',
			config: {
				description: 'Get a specific painting by ID.',
				tags: ['api', 'v1', 'painting']
			},
			handler: (req, reply) => {
				const { name, url, technique } = req.payload;
				const painting = new Painting({
					name,
					url,
					technique
				});
				return painting.save();
			}
		}
	]);
	await app.start();
}

StartServer().catch(error => console.log(error));

process.on('unHandledRejection', (err) => {
	if (err) {
		console.log(err);
		process.exit(1);
	}
});
