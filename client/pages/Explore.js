// Explore page
import Link from 'next/link';
import { useState, useRef } from 'react';
import Layout from '../components/Layout.js';
import Searches from '../components/explore/Searches.js';

import '../sass/explore.scss';


const Explore = () => {
	// variables for the query
	const [searchQuery, setSearchQuery] = useState("");
	const [currentPage, setCurrentPage ] = useState(1);
	const searchInput = useRef(null);

	// for search button: doing a search
	const doSearch = () => {
		setSearchQuery(searchInput.current.value);
		setCurrentPage(1);
	};
	const onEnter = e => { if (e.key === 'Enter') doSearch(); };

	return (
		<Layout pageTitle={`Explore the GIFs`}>
			<div id="welcome-div">
				<h1>
					Welcome to Frames!<br/>
					<Link href='/Register?show=signup'><a>Sign up</a></Link> to start collecting.
				</h1>
			</div>

			<div id="search-bar">
				<div>
					<input ref={searchInput}
					onKeyDown = {onEnter} 
					type="text" 
					placeholder="Search" />
					<button onClick={doSearch}>
						<i className="fas fa-search"></i>
					</button>
				</div>
			</div>

			<Searches 
				search_query={searchQuery} 
				current_page={currentPage} 
				setCurrentPage={setCurrentPage}
			/>
			

		</Layout>
	);
}
export default Explore;