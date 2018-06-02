const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/*
  notice there is no ID. That's because Mongoose will assign
  an ID by default to all schemas
*/

const PaintingSchema = new Schema({
	name: String,
	url: String,
	technique: String
});

module.exports = mongoose.model('Painting', PaintingSchema);
