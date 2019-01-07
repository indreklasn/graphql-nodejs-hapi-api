const hapi = require('hapi');
const mongoose = require('mongoose');
const Painting = require('./models/Painting')
const {ApolloServer } =require('apollo-server-hapi')
const schema = require('./graphql/schema');


const Inert = require('inert')
const Vision = require('vision')
const HapiSwagger = require('hapi-swagger')
const Pack = require('./package')


mongoose.connect('<given mlab url>',
	{ useNewUrlParser : true});

mongoose.connection.once('open' , () => {
	console.log('connected to DB')
})

const server = new ApolloServer({
    schema
  });

const app = hapi.server({
  port: 4000,
  host: "localhost"
});



const init = async () => {

	await app.register([
		Inert,
		Vision,
		{
			plugin: HapiSwagger,
			options: {
				info: {
					title: 'Paintings API Doc',
					version: Pack.version
				}
			}
		}
		])

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

	await server.applyMiddleware({ app })
	await app.start();
	console.log(`Server running at: ${app.info.uri}`);
};

init()