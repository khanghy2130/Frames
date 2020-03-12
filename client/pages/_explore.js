// Explore page
import Link from 'next/link';
import { useState, useRef } from 'react';

import Layout from '../components/Layout.js';
import Alert from '../components/Alert.js';
import Searches from '../components/explore/Searches.js';

import '../sass/pages/explore.scss';

// welcome div component
const welcomeDiv = (userContext) => {
	if (userContext) return (
		<h1>Welcome back,&nbsp;
			<Link href='/myProfile'>
				<a>{userContext.userinfo.name}</a>
			</Link>
		!</h1>
	);
	else return (
		<h1>
			Welcome to Frames!<br/>
			<a href='/login'>Log in</a> to start collecting.
		</h1>
	);
};

const explore = ({ userContext, errorMessage }) => {
	// show alert if error message was sent from server
	const [alertMessage, setAlertMessage] = useState(errorMessage);

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
		<Layout pageTitle={`Explore the GIFs`} userContext={userContext}>
			<div id="welcome-div">
				{welcomeDiv(userContext)}
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
				setAlertMessage={setAlertMessage}
			/>

			<Alert alertMessage={alertMessage} setAlertMessage={setAlertMessage} />
		</Layout>
	);
}

// returning the object of params for the component
explore.getInitialProps = async ({ query }) => query;

export default explore;