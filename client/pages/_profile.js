// Profile page of a user that is not the current user

import { useState } from 'react';
import Link from 'next/link';

import '../sass/pages/profile.scss';
import Layout from '../components/Layout.js';
import Alert from '../components/Alert.js';
import AddFriendButton from '../components/profile/AddFriendButton.js';


const CollectionsContainer = ({collections}) => {

	return (
		<div id="collections-container">
			{ collections.map(collection => (
				<div key={ collection._id } className="collection-item">
					<Link
					href={`/collection/${collection._id}`}>
						<a className="collection-title">
							{
								// render visibility icon
								<i className={
									[
										'fas fa-lock',
										'fas fa-user-friends',
										'fas fa-globe'
									][collection.visibility]
								}/>
							}

							&nbsp;&nbsp;
							{ `${collection.title} (${collection.gifs.length})` }
						</a>
					</Link>
				</div>
			)) }
		</div>
	);
};

// userData will have property friendshipStatus (from current user perspective)
const profile = ({ userContext, userData, friendshipStatus }) => {
	const [alertMessage, setAlertMessage] = useState(null);
	// for updating button text: clicking "Add Friend" -> "Requested"
	const [fStatus, setFStatus] = useState(friendshipStatus);
	
	return (
		<Layout 
		mainCssId="profile-main"
		pageTitle={`${userData.display_name}'s profile`}
		isAuthenticated={userContext ? true : false}>

			<section id="profile-info-section">
				<h1>{userData.display_name}</h1>
				<div id="avatar-div">
					<img alt="avatar"
						src={`https://avatars.dicebear.com/v2/avataaars/${userData.avatar_seed}.svg`}
					/>
				</div>
				<AddFriendButton 
				fStatus={fStatus}
				setFStatus={setFStatus}
				userContext={userContext} 
				userData={userData} 
				setAlertMessage={setAlertMessage} />
			</section>

			<section id="profile-contents-section">
				<section id="collections-section">
					<h1>Collections</h1>
					<CollectionsContainer collections={userData.collections} />
				</section>
			</section>

			<Alert alertMessage={alertMessage} setAlertMessage={setAlertMessage} />
		</Layout>
	);
};


// returning the object of params for the component
profile.getInitialProps = async ({ query }) => query;

export default profile