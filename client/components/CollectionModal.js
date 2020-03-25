// shown when open a collection
// in /myProfile and /profile routes

import axios from "axios";
import { useState } from 'react';

import ReactImageFallback from 'react-image-fallback';
import spinnerImage from '../images/spinner.gif';
import GifModal from './GifModal.js';

export default ({ 
	setAlertMessage, 
	isOwner, 

	showSelected, 
	setShowSelected,

	selectedCollection,
	collections, // to update when back button is clicked
	setCollections
}) => {

	if (!showSelected) return (null); // closed state

	const [deleteMode, setDeleteMode] = useState(false);
	const [selectedGif, setSelectedGif] = useState(null);

	const closeModal = () => {
		setShowSelected(false);
	};

	const gifClicked = gifObj => {
		// delete mode on?
		if (deleteMode){
			console.log("deleting", gifObj.title);/////////////////
		}
		else {
			// open gif modal
			setSelectedGif({
				title: gifObj.title,
				url: gifObj.url
			});
		}
	};

	
	const toggleDeleteMode = () => {
		setDeleteMode(!deleteMode);
	};

	return (
		<div id="collection-modal">
			<div id="collection-modal-content">

				<GifModal 
				gifObj={selectedGif} 
				setGifObj={setSelectedGif} // for closing gif modal
				setAlertMessage={setAlertMessage}
				loggedIn={true} 

				collections={collections}
				setCollections={setCollections}/>

				<div id="collection-modal-buttons-div">
					<button onClick={closeModal}>
						Back
					</button>
					{
						(isOwner) ? (
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
							][selectedCollection.visibility]
						}/>
					}

					&nbsp;&nbsp;
					{selectedCollection.title}
				</h1>

				{
					selectedCollection.gifs.length === 0 ? (
						<p>This collection has no GIF yet.</p>
					) : (
						deleteMode ? (
							<p>Click a gif to remove it from this collection.</p>
						) : (null)
					)
				}

				<div id="collection-modal-gifs-container">
					{selectedCollection.gifs.map( gifObj => (
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
	);
};