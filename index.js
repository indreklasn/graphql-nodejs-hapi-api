const hapi = require('hapi');
const mongoose = require('mongoose');
const Painting = require('./models/Painting');

const server = hapi.server({
	port: 4000,
	host: 'localhost'
});

mongoose.connect('mongodb://indrek:test@ds231090.mlab.com:31090/powerful-api');

mongoose.connection.once('open', () => {
	console.log('connected to database');
});

const init = async () => {
	server.route([
		{
			method: 'GET',
			path: '/',
			handler: function(request, reply) {
				return `<h1>My modern api</h1>`;
			}
		},
		{
			method: 'GET',
			path: '/api/v1/paintings',
			handler: (req, reply) => {
				return Painting.find();
			}
		},
		{
			method: 'POST',
			path: '/api/v1/paintings',
			handler: (req, reply) => {
				const { name, url, techniques } = req.payload;
				const painting = new Painting({
					name,
					url,
					techniques
				});

				return painting.save();
			}
		}
	]);

	await server.start();
	console.log(`Server running at: ${server.info.uri}`);
};

process.on('unHandledRejection', (err) => {
	if (err) {
		console.log(err);
		process.exit(1);
	}
});

init();
