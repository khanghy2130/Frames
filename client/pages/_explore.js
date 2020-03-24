// Explore page
// Show alert

import Link from 'next/link';
import { useState, useRef } from 'react';

import Layout from '../components/Layout.js';
import Alert from '../components/Alert.js';
import Searches from '../components/explore/Searches.js';

import '../sass/pages/explore.scss';



//////////////////////////// quick gif model testing 
import GifModal from '../components/GifModal.js';

// welcome div component
const welcomeDiv = (userContext) => {
	if (userContext) return (
		<h1>Welcome back, &shy;
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

const explore = ({ userContext, serverMessage }) => {
	// show alert if a message was defined from server
	const [alertMessage, setAlertMessage] = useState(serverMessage);

	// variables for the query
	const [searchQuery, setSearchQuery] = useState("");
	const [currentPage, setCurrentPage ] = useState(1);
	const searchInput = useRef(null);

	// gifObj for when open up gif modal
	const [gifObj, setGifObj] = useState(null);

	// for search button: doing a search
	const doSearch = () => {
		/*
		setSearchQuery(searchInput.current.value);
		setCurrentPage(1);*/

		///////////////////////////////////////// dummy data for testing
		setGifObj({
			title: "dummy gif",
			url: "https://media2.giphy.com/media/chGsPoJZke5eo/giphy.webp?cid=cd718905f2eafcc210100cde65df5804760de568785ad4e2&rid=giphy.webp"
		});
	};
	const onEnter = e => { if (e.key === 'Enter') doSearch(); };
	
	return (
		<Layout
		mainCssId="explore-main"
		pageTitle="Explore the GIFs"
		isAuthenticated={userContext ? true : false}>
			<div id="welcome-div">
				{welcomeDiv(userContext)}
			</div>
		<GifModal gifObj={gifObj} 
	setGifObj={setGifObj} 
setAlertMessage={setAlertMessage} 
userContext={userContext}/> {/*////////////gif modal testing//////////////////////*/}
			<div id="search-bar">
				<div>
					<input ref={searchInput}
					onKeyDown = {onEnter} 
					type="text" 
					placeholder="Search" />
					<button onClick={doSearch} title="Search">
						<i className="fas fa-search"/>
					</button>
				</div>
			</div>

			<Searches 
				search_query={searchQuery} 
				current_page={currentPage} 
				setCurrentPage={setCurrentPage}
				setAlertMessage={setAlertMessage}
				gifObj={gifObj}
				setGifObj={setGifObj}
				userContext={userContext}
			/>

			<Alert alertMessage={alertMessage} setAlertMessage={setAlertMessage} />
		</Layout>
	);
}

// returning the object of params for the component
explore.getInitialProps = async ({ query }) => query;

export default explore;