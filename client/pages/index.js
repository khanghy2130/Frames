// Home / Landing page / Explore page

import Head from 'next/head';
import Layout from '../components/Layout.js';
import Searches from '../components/Searches.js';

import '../sass/home.scss';
import searchSuggestions from '../images/search_suggestions.png';

const Index = () => (
	<Layout>
		<Head>
			<title>Frames</title>
		</Head>

		<div id="landing-div"></div>
		<div id="search-bar">
			<div>
				<input type="text" placeholder="Search" />
				<button><i className="fas fa-search"></i></button>
			</div>
		</div>

		<Searches />


		{/* show div no-search as default and when no result found */}
		<div id="no-search">
			<img id="ss_image" src={searchSuggestions} alt="search suggestions" />
		</div>
		

	</Layout>
)
export default Index