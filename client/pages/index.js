// Home / Landing page / Explore page

import { useState, useRef } from 'react';
import Head from 'next/head';
import Layout from '../components/Layout.js';
import Searches from '../components/Searches.js';

import '../sass/home.scss';


const Index = () => {
	const [searchQuery, setSearchQuery] = useState("");
	const searchInput = useRef(null);

	// for search button
	const doSearch = () => { setSearchQuery(searchInput.current.value) };

	return (
		<Layout>
			<Head>
				<title>Frames</title>
			</Head>

			<div id="landing-div"></div>
			<div id="search-bar">
				<div>
					<input ref={searchInput} type="text" placeholder="Search" />
					<button onClick={doSearch}>
						<i className="fas fa-search"></i>
					</button>
				</div>
			</div>

			<Searches search_query={searchQuery} />
			

		</Layout>
	);
}
export default Index