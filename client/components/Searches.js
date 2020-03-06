import PropTypes from "prop-types";
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import withApollo from '../lib/withApollo.js';

import searchSuggestions from '../images/search_suggestions.png';


// show suggestions as default
const suggestionsImage = () => (
	<div id="no-search">
		<img id="ss_image" src={searchSuggestions} alt="search suggestions" />
	</div>
);
 
const Searches = ({ search_query }) => {
	if (search_query.length === 0) return suggestionsImage();


	const QUERY = gql`
		query SearchResponseQuery($search_query: String!) {

			# >> The object retrieved from API
			search_response(search_query: $search_query) {
				# >> List of GIF objects
				data {
					id
					images {
						original {
							url
						}
					}
				}

				# >> Meta info
				pagination {
					total_count
					count
					offset
				}
			}
			
		}
	`;

	const { error, loading, data } = useQuery(QUERY, { variables: {search_query} });

	if (loading || !data) {
		return <h1>loading...</h1>;
	}
	if (error){
		return <h1>Error occurred while fetching data.</h1>;
	}

	// DATA RETRIEVED -> but zero results?
	if (data.search_response.data.length === 0) return (
		<h3 id="no-result-text">No results found.</h3>
	);
	
	return (
		<div id="results-container">
			{data.search_response.data.map( (item) => (
				<div className="gif-div" key={item.id}>
					<img src={item.images.original.url} />
				</div>
			) )}
		</div>
	);
};

// check prop type
Searches.propTypes = {
  search_query: PropTypes.string.isRequired,
}

export default withApollo(Searches);