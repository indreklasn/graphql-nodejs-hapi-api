const graphql = require('graphql');

const PaintingType = require('./PaintingType');

const Painting = require('../models/Painting');

const {
	GraphQLObjectType,
	GraphQLString,
	GraphQLSchema,
	GraphQLList
} = graphql;

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
				return painting.save()
			}
		}
	}
})


module.exports = new GraphQLSchema({
	query: RootQuery,
	mutation: Mutation
})