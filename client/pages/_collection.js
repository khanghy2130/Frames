// show collection page

import axios from "axios";
import { useState } from 'react';
import Link from 'next/link';
import ReactImageFallback from 'react-image-fallback';

import Layout from '../components/Layout.js';
import Alert from '../components/Alert.js';
import GifModal from '../components/GifModal.js';
import spinnerImage from '../images/spinner.gif';

const Collection = ({ userContext, dataResponse, previousRoute }) => {
	const [alertMessage, setAlertMessage] = useState(null);
	const [deleteMode, setDeleteMode] = useState(false);
	const [selectedGif, setSelectedGif] = useState(null);
	
	// ERROR rendering
	if (dataResponse.err_message){
		setAlertMessage(dataResponse.err_message);
		return (
			<Layout pageTitle={`Error`} userContext={userContext}>
				<Alert alertMessage={alertMessage} setAlertMessage={setAlertMessage} />
			</Layout>
		);
	}

	const [gifsList, setGifsList] = useState(dataResponse.collection.gifs || null);

	const toggleDeleteMode = () => {
		setDeleteMode(!deleteMode);
	};

	const gifClicked = gifObj => {
		// delete mode on?
		if (deleteMode){
			// update UI
			setGifsList(gifsList.filter( g => (gifObj !== g) ));

			// send request
			axios.post('/delete_gif', {
				collection_id: dataResponse.collection._id,
				gifObj: gifObj
			});
		}
		else {
			// open gif modal
			setSelectedGif({
				title: gifObj.title,
				url: gifObj.url
			});
		}
	};

	return (
		<Layout pageTitle={`View Collection`} userContext={userContext}>
			<div id="collection-modal">
				<div id="collection-modal-content">

					<GifModal 
					gifObj={selectedGif} 
					setGifObj={setSelectedGif} // for closing gif modal
					setAlertMessage={setAlertMessage}
					loggedIn={(userContext) ? true : false} />

					<div id="collection-modal-buttons-div">
						<Link 
						href={`/profile/${dataResponse.collection.owner_okta_id}`}>
							<a>Back</a>
						</Link>
						{
							(dataResponse.isOwner) ? (
								<button onClick={toggleDeleteMode}
								className={(deleteMode) ? "delete-mode-on" : ""}>
									{ (deleteMode) ? "Delete Mode: On" :
									 "Delete Mode: Off" }
								</button>
							) : (null)
						}
						
					</div>

					<h1>
						{ 
							// render visibility icon
							<i className={
								[
									'fas fa-lock',
									'fas fa-user-friends',
									'fas fa-globe'
								][dataResponse.collection.visibility]
							}/>
						}

						&nbsp;&nbsp;
						{dataResponse.collection.title}
					</h1>

					{
						gifsList.length === 0 ? (
							<p>This collection has no GIF yet.</p>
						) : (
							deleteMode ? (
								<p>Click a gif to remove it from this collection.</p>
							) : (null)
						)
					}

					<div id="collection-modal-gifs-container">
						{gifsList.map( gifObj => (
							<div key={gifObj._id}
							className="gif-div" >
								<ReactImageFallback 
									onClick={ () => {gifClicked(gifObj)} }
									className={(deleteMode) ? " delete-mode-on" : ""} 
									src={gifObj.url}
									initialImage={spinnerImage}
									fallbackImage={spinnerImage}
								/>
							</div>
						) )}
					</div>

				</div>
			</div>
			
			<Alert alertMessage={alertMessage} setAlertMessage={setAlertMessage} />
		</Layout>
	);
}

// returning the object of params for the component
Collection.getInitialProps = async ({ query }) => query;

export default Collection