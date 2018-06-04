const graphql = require('graphql');

const { GraphQLObjectType, GraphQLString, GraphQLList } = graphql;

const PaintingType = new GraphQLObjectType({
    name: 'Painting',
    fields: () => ({
        id: { type: GraphQLString },
        name: { type: GraphQLString },
        url: { type: GraphQLString },
        techniques: { type: new GraphQLList(GraphQLString) }
    })
});

module.exports = PaintingType;
