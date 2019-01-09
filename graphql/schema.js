const graphql = require('graphql');

const { PubSub } = require('apollo-server');

const PaintingType = require('./PaintingType');

const Painting = require('../models/Painting');

const {
	GraphQLObjectType,
	GraphQLString,
	GraphQLSchema,
	GraphQLList,
	GraphQLNonNull
} = graphql;

const pubsub = new PubSub()

const PAINTING_ADDED = 'PAINTING_ADDED'

const RootQuery = new GraphQLObjectType({
	name: 'RootQueryType',
	fields: {
		painting: {
			type: PaintingType,
			args: { id : {type : GraphQLString } },
			resolve(parent, args){
				return Painting.findById(args.id)
			}
		},
		allPaintings: {
			type: new GraphQLList(PaintingType),
			resolve(parent ,args) {
				return Painting.find()
			}
		}
	}
})

const Mutation = new GraphQLObjectType({
	name: 'Mutation',
	fields: {
		createPainting: {
			type: PaintingType,
			args: {name: { type: GraphQLString} , url:{ type: GraphQLString }},
			resolve(parent,args){
				const painting = new Painting({name : args.name , url : args.url})
				const saved = painting.save()
				saved.then((doc) => {pubsub.publish(PAINTING_ADDED, {doc})})
				return saved
			}
		},
		updatePainting: {
			type: PaintingType,
			args: { id: {type: GraphQLString} , name: {type: GraphQLString} , url : {type: GraphQLString}},
			resolve(parent,args) {
				Painting.findByIdAndUpdate(args.id , {name : args.name , url: args.url})
				return Painting.findById(args.id)
			}
		},
		deletePainting: {
			type: PaintingType,
			args: {id : {type : new  GraphQLNonNull(GraphQLString)}},
			resolve(parent,args) {
				return Painting.findByIdAndDelete(args.id)
			}
		}
	}
})

const subscription = new GraphQLObjectType({
	name: 'Subscription',
	fields: {
		paintingAdded: {
			type : PaintingType,
			subscribe: () => pubsub.asyncIterator([PAINTING_ADDED]),
			resolve: source => {return Painting.findById(source.doc._id)}
		}
	}
})


module.exports = new GraphQLSchema({
	query: RootQuery,
	mutation: Mutation,
	subscription
})