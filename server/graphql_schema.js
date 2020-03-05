const axios = require('axios');


const { 
	GraphQLSchema,
	GraphQLObjectType, 
	GraphQLInt, 
	GraphQLString,
	GraphQLBoolean,
	GraphQLList
} = require('graphql');
//////////////////// only import what is needed


// User Type
const UserType = new GraphQLObjectType({
	name: 'User',

	// this function returns an object
	fields: () => ({
		id: { type: GraphQLInt },
		name: { type: GraphQLString },
		email: { type: GraphQLString },
		website: { type: GraphQLString }
	}) 
});


// Root Query
const RootQuery = new GraphQLObjectType({
	name: 'RootQueryType',
	fields: {
		// this query is getting a list
		users: {
			type: new GraphQLList(UserType),
			resolve(parent, args) {
				return axios.get('https://jsonplaceholder.typicode.com/users')
					.then(res => res.data);
			}
		}
	}
});

module.exports = new GraphQLSchema({
	query: RootQuery
});

