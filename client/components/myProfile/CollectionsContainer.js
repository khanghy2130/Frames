import axios from "axios";
import PropTypes from "prop-types";
import { useState, useRef } from 'react';


const EditModal = ({ setAlertMessage, showEdit, setShowEdit, selectedCollection, collections, setCollections }) => {
	if (!showEdit) return (null); // hidden

	const titleInput = useRef(null);
	const visibilityInput = useRef(null);

	const removeCollection = () => {
		// remove the display of the collection
		setCollections(collections.filter(c => c._id !== selectedCollection._id));
		setShowEdit(false); // close

		// send POST request to remove in database (also update user data)
		axios.post('/myProfile/remove_collection', {
			collection_id: selectedCollection._id
		}).catch(err => {
			console.log(err);
			setAlertMessage("Error while removing collection.");
		});
	};
	// changes_data contains title and visibility
	const save = () => {
		// alert if title is empty
		if (titleInput.current.value.length === 0){
			setAlertMessage("Title cannot be empty.");
			return;
		}

		// update display of the collection
		setCollections(collections.map(c => {
			// is target collection
			if (c._id === selectedCollection._id){
				c.title = titleInput.current.value,
				c.visibility = visibilityInput.current.value
			}
			return c;
		}));
		setShowEdit(false); // close

		// send POST request to update in database
		axios.post('/myProfile/update_collection', {
			collection_id: selectedCollection._id,
			changes_data: {
				title: titleInput.current.value,
				visibility: visibilityInput.current.value
			}
		}).catch(err => {
			console.log(err);
			setAlertMessage("Error while editing collection.");
		});
	};
	const cancel = () => {setShowEdit(false);};

	// passing a key will make sure to update default values when change target
	return (
		<div id="collection-edit-modal" key={selectedCollection._id}>
			<div>
				<div id="remove-btn-container">
					<button onClick={removeCollection}>
						<i className="fas fa-trash"/>&nbsp;Remove collection
					</button>
				</div>
				<div id="edit-form">
					<label>Title</label>
					<input type="text" 
						defaultValue={selectedCollection.title}
						ref={titleInput}
					/>
					<label>Visibility</label>
					<select 
						defaultValue={selectedCollection.visibility + ""}
						ref={visibilityInput}
					>
						<option value="0">Private</option>
						<option value="1">Friends only</option>
						<option value="2">Public</option>
					</select>

					<div>
						<button onClick={save}>
							<i className="fas fa-check"/>&nbsp;Save
						</button>
						<button onClick={cancel}>
							<i className="fas fa-times"/>&nbsp;Cancel
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};


const CollectionsContainer = ({ setAlertMessage, collections, setCollections }) => {
	const [showEdit, setShowEdit] = useState(false);
	const [selectedCollection, setSelectedCollection] = useState(null);

	// when clicked on the binded collection
	const openCollection = function() {
		////////////////////// set alert if err_message is defined
		console.log(this.title);
	};

	// when clicked on the edit button
	const editCollection = function() {
		// set the target collection and open edit modal
		setSelectedCollection(this);
		setShowEdit(true);
	};

	const addNewCollection = function(){
		// make a request to create and save a new collection, and retrieve it
		axios.post('/myProfile/create_collection', {})
		.then(response => {
			if (response.data.err){
				setAlertMessage("Error while creating new collection.");
			}
			else {
				// add to the displaying list
				setCollections(collections => [...collections, response.data.newCollection]); 
			}
		})
		.catch(error => {
			console.log(error);
			setAlertMessage("Error while creating new collection.");
		});
	};

	return (
		<div id="collections-container">
			{ collections.map(collection => (
				<div key={ collection._id } className="collection-item">
					<button className="collection-title"
					onClick={ openCollection.bind(collection) }>
						<span key={collection._id + collection.visibility}>
						{ 
							// use key in span to update icon when changed
							// render visibility icon
							<i className={
								[
									'fas fa-lock',
									'fas fa-user-friends',
									'fas fa-globe'
								][collection.visibility]
							}/>
						}
						</span>

						&nbsp;&nbsp;
						{ `${collection.title} (${collection.gifs.length})` }
					</button>
					<button className="collection-edit" title="Edit"
					onClick={ editCollection.bind(collection) }>
						<i className="fas fa-cog"/>
					</button>
				</div>
			)) }

			<button id="create-collection-button"
			onClick={ addNewCollection }>
				<i className="fas fa-plus-circle"/>&nbsp;&nbsp;Create new collection
			</button>

			<EditModal 
				setAlertMessage={setAlertMessage}
				showEdit={showEdit}
				setShowEdit={setShowEdit}
				selectedCollection={selectedCollection}
				collections={collections}
				setCollections={setCollections}
			/>
		</div>
	);
};

// check prop type
CollectionsContainer.propTypes = {
	setAlertMessage: PropTypes.func.isRequired,
	collections: PropTypes.array.isRequired,
	setCollections: PropTypes.func.isRequired
};

export default CollectionsContainer;