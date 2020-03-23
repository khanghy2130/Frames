// viewing a gif, showing collections to add to
// get current user's collections data everytime this component renders
// shown when open a gif from search results (/explore) or from collection modals

import axios from "axios";
import { useState, useEffect } from 'react';
import ReactImageFallback from 'react-image-fallback';

import spinnerImage from '../images/spinner.gif';


export default ({ gifObj, setGifObj, setAlertMessage, userContext }) => {
	if (!gifObj) return (null); // closed state

	const closeGifModal = () => { setGifObj(null) };

	// GOAL: get collections data before showing modal
	const [collections, setCollections] = useState(null);

	useEffect(() => {
		// unauthenticated ?
		if (!userContext){
			return null;
		}
		(async function(){
			console.log("sending request"); ///////////// keep track of when it sends
			const result = await axios.get('/get_my_collections');

			// error occurred
			if (result.data.err_message){
				setAlertMessage(result.data.err_message);
				return closeGifModal(); // end this function
			}

			// data fetched
			setCollections(result.data.collections);
		})()
	}, []);


	// render this if still fetching collections data
	if (!collections && userContext) return (
		<div id="gif-modal-loading">
			Loading...
		</div>
	);

	const addGif = collection => {
		// update UI for this collection item
		setCollections(collections.map(c => {
			if (c === collection){
				c.gifs.push({}); // push a dummy item to bump up the length
				c.added = true;
				return c;
			}
			else return c;
		}));
	};


	return (
		<div id="gif-modal">
			<div id="gif-modal-content">

				<div className="close-button-div">
					<button onClick={closeGifModal}>Close</button>
				</div>

				<div id="gif-info">
					<h1>{gifObj.title}</h1>
					<ReactImageFallback 
						src={gifObj.url}
						initialImage={spinnerImage}
						fallbackImage={spinnerImage}
					/>
				</div>

				<div id="add-to-collections-div">
					{	
						// not logged in?
						(!userContext) ? (
							<p id="not-logged-in">
								<a href='/login'>Log in</a> to start collecting.
							</p>
						) : (
							collections.map(c => (
								<div className="add-collection-item"
								key={c._id}>
									<h3>
										{ 
											// render visibility icon
											<i className={
												[
													'fas fa-lock',
													'fas fa-user-friends',
													'fas fa-globe'
												][c.visibility]
											}/>
										}

										&nbsp;&nbsp;
										{ `${c.title} (${c.gifs.length})` }
									</h3>
									{
										(!c.added) ? (
											<button onClick={ () => {addGif(c)} }>
												Add
											</button>
										) : (
											<button disabled>
												Added
											</button>
										)
									}
									
								</div>
							))
						)
					}
				</div>

			</div>
		</div>
	);
	
};