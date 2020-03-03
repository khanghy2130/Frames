// Home page / Landing page / Explore page

import Layout from '../components/Layout.js';

import '../sass/home.scss';
import searchSuggestions from '../images/search_suggestions.png';

const Index = () => (
	<Layout>
		<div id="landing-div"></div>
		<div id="search-bar">
			<div>
				<input type="text" placeholder="Search" />
				<button><i className="fas fa-search"></i></button>
			</div>
		</div>

		{/* show div no-search as default and when no result found */}
		<div id="no-search">
			<img id="ss_image" src={searchSuggestions} alt="search suggestions" />
		</div>
		

	</Layout>
)
export default Index