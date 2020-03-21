// Page of the user's profile

import { useState } from 'react';

import '../../sass/pages/myProfile.scss';
import Layout from '../../components/Layout.js';
import Alert from '../../components/Alert.js';
import AvatarDiv from '../../components/myProfile/AvatarDiv.js';
import FriendsContainer from '../../components/myProfile/FriendsContainer.js';
import CollectionsContainer from '../../components/myProfile/CollectionsContainer.js';

// userData is defined
const myProfile = ({ userData }) => {
	const [alertMessage, setAlertMessage] = useState(null);

	// collections data
	const [collections, setCollections] = useState(userData.collections);

	// friends data
	const [friends, setFriends] = useState(userData.friends);

	return (
		<Layout 
		mainCssId="myProfile-main"
		pageTitle={`My Profile`}
		isAuthenticated={true}>

			<section id="profile-info-section">
				<h1>{userData.display_name}</h1>
				<AvatarDiv
				avatar_seed={userData.avatar_seed}
				display_name={userData.display_name} />

				<form method="post" action="/logout">
				    <button id="logout-button" type="submit">
				    	<i className="fas fa-sign-out-alt"/>&nbsp;Log out
				    </button>
				</form>
			</section>

			<section id="profile-contents-section">
				<section id="friends-section">
					<h1 className="content-header">My Friends</h1>
					<FriendsContainer
					userData={userData}
					friends={friends}
					setFriends={setFriends} />
				</section>

				<section id="collections-section">
					<h1  className="content-header">My Collections</h1>
					<CollectionsContainer 
					setAlertMessage={setAlertMessage}
					collections={collections}
					setCollections={setCollections} />
				</section>
			</section>

			<Alert alertMessage={alertMessage} setAlertMessage={setAlertMessage} />
		</Layout>
	);
};

// returning the object of params for the component
myProfile.getInitialProps = async ({ query }) => query;

export default myProfile