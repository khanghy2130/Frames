import PropTypes from "prop-types";
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import withApollo from '../../lib/withApollo.js';

import ReactImageFallback from 'react-image-fallback';
import { Fragment } from 'react';

import GifModal from '../GifModal.js';

import searchSuggestions from '../../images/search_suggestions.png';
import spinnerImage from '../../images/spinner.gif'; // showed while loading results

// show suggestions as default
const suggestionsImage = () => (
	<div id="no-search">
		<img id="ss_image" src={searchSuggestions} alt="search suggestions" />
	</div>
);
 
const Searches = ({ 
	search_query, 
	current_page, 
	setCurrentPage, 
	setAlertMessage,
	
	gifObj,
	setGifObj,
	userContext
}) => {
	

	if (search_query.length === 0) return suggestionsImage();


	const QUERY = gql`
		query SearchResponseQuery($search_query: String!, $current_page: Int!) {

			# >> The object retrieved from API
			search_response(search_query: $search_query, current_page: $current_page) {
				# >> List of GIF objects
				data {
					id
					title
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

	const { error, loading, data } = useQuery(QUERY, { variables: {search_query, current_page} });

	// conditional rendering
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


	const gifClicked = function(item) {
		setGifObj({
			title: item.title,
			url: item.images.original.url
		});
	};

	const pageInfo = {
		current: pagination.offset / 20 + 1, // offset is dividable by 20
		total: Math.ceil(pagination.total_count / 20),
		goToPage: function() {
			const pNum = Number(document.getElementById('page-number-input').value);
			
			// is current?
			if (pNum === pageInfo.current){
				setAlertMessage(`Already on page ${pNum}`);
			}
			// not within range?
			else if (pNum < 1 || pNum > pageInfo.total){
				setAlertMessage(`Please enter a page from 1 to ${pageInfo.total}`);
			}
			else {
				setCurrentPage(pNum)
				document.body.scrollTop = 0; // For Safari
  				document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera;
			}
		},
		goNextPage: function() {
			setCurrentPage(pageInfo.current + 1);
			document.body.scrollTop = 0; // For Safari
  			document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
		}
	}
	
	// gifs data retrieved, render results container and results info like page number
	return (
		<Fragment>
			<GifModal 
			gifObj={gifObj} 
			setGifObj={setGifObj} 
			setAlertMessage={setAlertMessage}
			loggedIn={(userContext) ? true : false} />

			<div id="results-container">
				{results_data.map( (item) => (
					<div className="gif-div" key={item.id}>
						<ReactImageFallback 
							onClick={ () => {gifClicked(item)} } 
							src={item.images.original.url}
							initialImage={spinnerImage}
						/>
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
						<input id="page-number-input" 
						type="number" 
						defaultValue={pageInfo.current}
						min={1} max={pageInfo.total} />
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
  current_page: PropTypes.number.isRequired,
  setCurrentPage: PropTypes.func.isRequired
}

export default withApollo(Searches);