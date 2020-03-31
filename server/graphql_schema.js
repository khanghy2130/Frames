const API_KEY = process.env.API_KEY;

const axios = require('axios');
const { 
	GraphQLSchema,
	GraphQLObjectType, 
	GraphQLInt, 
	GraphQLString,
	GraphQLList
} = require('graphql');


// the object that is retrieved from API
const SearchResponseType = new GraphQLObjectType({
	name: "Search_Response",

	fields: () => ({
		// a list of gif objects
		data: { type: new GraphQLList(GifObjectType) },
		// meta info of the main response
		pagination: { type: PaginationType }
	})
});

// (individual) Gif Object Type 
const GifObjectType = new GraphQLObjectType({
	name: 'Gif_Object',

	fields: () => ({
		id: { type: GraphQLString },
		title: { type: GraphQLString },

		// getting images.original.url
		images: { type: new GraphQLObjectType({
			name: 'Images',
			fields: () => ({
				original: { type: new GraphQLObjectType({
					name: 'Original',
					fields: () => ({
						url: { type: GraphQLString }
					})
				}) }
			})
		}) }
	}) 
});

const PaginationType = new GraphQLObjectType({
	name: "Pagination",
	fields: () => ({
		total_count: { type: GraphQLInt },
		count: { type: GraphQLInt },
		offset: { type: GraphQLInt }
	})
});


// Root Query
const RootQuery = new GraphQLObjectType({
	name: 'RootQueryType',
	fields: {
		// this query is getting a list
		search_response: {
			type: SearchResponseType,
			args: {
				// query variables
				search_query: { type: GraphQLString },
				current_page: { type: GraphQLInt }
			},
			resolve(parent, args) {
				return axios
				.get(`https://api.giphy.com/v1/gifs/search?api_key=${API_KEY}&q=${args.search_query}&offset=${(args.current_page-1)*20}&limit=20&rating=pg`)
				.then(res => (res.data));
			}
		}
	}
});

module.exports = new GraphQLSchema({
	query: RootQuery
});

