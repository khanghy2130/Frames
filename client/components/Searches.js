import PropTypes from "prop-types";
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import withApollo from '../lib/withApollo.js';
import { Fragment, useRef } from 'react';

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
							webp
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

	if (loading || !data) return (
		<h3 className="search-message">Loading...</h3>
	);
	if (error) return (
		<h3 className="search-message">Error occurred while fetching data.</h3>
	);

	// DATA RETRIEVED -> but zero results?
	if (data.search_response.data.length === 0) return (
		<h3 className="search-message">No results found.</h3>
	);

	// deconstructing the response
	const { data: results_data, pagination } = data.search_response;

	// when a gif is clicked
	const gifClicked = function(item) {
		console.log(item.images.original.webp);
	};

	const pageInfo = {
		current: pagination.offset / 20 + 1, // offset is dividable by 20
		total: Math.ceil(pagination.total_count / 20),
		goToPage: function() {
			const pNum = Number(document.getElementById('page-number-input').value);
			
			// is current?
			if (pNum === pageInfo.current){
				alert(`Already on page ${pNum}`);
			}
			// not within range?
			else if (pNum < 1 || pNum > pageInfo.total){
				alert(`Please enter a page from 1 to ${pageInfo.total}`);
			}
			else {
				alert("VALID NUMBER!");
			}
		},
		goNextPage: function() {
			alert("GOING TO NEXT PAGE!");
		}
	}
	
	return (
		<Fragment>
			<div id="results-container">
				{results_data.map( (item) => (
					<div className="gif-div" key={item.id}>
						<img onClick={ () => {gifClicked(item)} } 
						src={item.images.original.webp} />
					</div>
				) )}
			</div>

			<div id="results-info-div">
				<div>
					{ // render next button if not on last page
						pageInfo.current !== pageInfo.total && 
						<button onClick={pageInfo.goNextPage}>Next Page</button>
					}
					<p>Page {pageInfo.current} out of {pageInfo.total}</p>
					
					<div>
						<label>Go to page: </label>
						<input id="page-number-input" type="number" defaultValue={pageInfo.current} />
						<button onClick={pageInfo.goToPage}>Go</button>
					</div>
				</div>
			</div>
		</Fragment>
	);
};

// check prop type
Searches.propTypes = {
  search_query: PropTypes.string.isRequired,
}

export default withApollo(Searches);

/*
// render results-info-div for testing
export default () => (
	<div id="results-info-div">
		<div>
			<button>Next Page</button>
			<p>Page 2 out of 20</p>
			
			<div>
				<label>Go to page: </label>
				<input id="page-number-input" type="number" defaultValue="1"/>
				<button>Go</button>
			</div>
		</div>
	</div>
);*/