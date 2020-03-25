// viewing a gif, showing collections to add to
// get current user's collections data everytime this component renders
// shown when open a gif from search results (/explore) or from collection modals

import axios from "axios";
import { useState, useEffect, Fragment } from 'react';
import ReactImageFallback from 'react-image-fallback';

import spinnerImage from '../images/spinner.gif';


export default ({ 
	gifObj, 
	setGifObj, 
	setAlertMessage, 
	loggedIn
}) => {
	if (!gifObj) return (null); // closed state

	const closeGifModal = () => { setGifObj(null) };

	const [collections, setCollections] = useState(null);

	useEffect(() => {
		// authenticated ?
		if (loggedIn){
			(async function(){
				const result = await axios.get('/get_my_collections');

				// error occurred
				if (result.data.err_message){
					setAlertMessage(result.data.err_message);
					return closeGifModal(); // end this function
				}

				// data fetched
				setCollections(result.data.collections);
			})()
		}
			
	}, []);


	// render this if still fetching collections data
	if (!collections && loggedIn) return (
		<div id="gif-modal-loading">
			Loading...
		</div>
	);

	const addGif = collection => {
		// update UI for this collection item
		setCollections(collections.map(c => {
			if (c === collection){
				const dummyGif = {
					_id: c.gifs.length, // temporary for key
					title: gifObj.title,
					url: gifObj.url
				};
				c.gifs.push(dummyGif);
				c.added = true;
				return c;
			}
			else return c;
		}));

		// send request
		axios.post('/add_gif', {
			collection_id: collection._id,
			gifObj: {
				title: gifObj.title,
				url: gifObj.url
			}
		});
	};

	const createCollection = () => {
		// make a request to create and save a new collection, and retrieve it
		axios.post('/myProfile/create_collection', {})
		.then(response => {
			if (response.data.err){
				setAlertMessage("Error while creating new collection.");
			}
			else {
				// add to the displaying list
				setCollections(
					collections => [...collections, response.data.newCollection]
				); 
			}
		})
		.catch(error => {
			console.log(error);
			setAlertMessage("Error while creating new collection.");
		});
	};

	return (
		<div id="gif-modal">
			<div id="gif-modal-content">

				<div className="close-button-div">
					<button onClick={closeGifModal}>
						<i className="fas fa-times" />&nbsp;Close
					</button>
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
						(!loggedIn) ? (
							<p id="not-logged-in">
								<a href='/login'>Log in</a> to start collecting.
							</p>
						) : (<Fragment>
								{collections.map(c => (
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
												<button className="enabled-btn"
												onClick={ () => {addGif(c)} }>
													Add
												</button>
											) : (
												<button disabled>
													Added
												</button>
											)
										}
										
									</div>
								))}

								<button id="create-collection-btn"
								onClick={createCollection}>
									Create new collection
								</button>
							</Fragment>
						)
					}
				</div>

			</div>
		</div>
	);
	
};