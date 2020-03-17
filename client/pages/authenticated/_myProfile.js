// Page of the user's profile

import Link from 'next/link';
import { useState } from 'react';

import '../../sass/pages/myProfile.scss';
import Layout from '../../components/Layout.js';
import Alert from '../../components/Alert.js';
import AvatarDiv from '../../components/myProfile/AvatarDiv.js';
import CollectionsContainer from '../../components/myProfile/CollectionsContainer.js';


const myProfile = ({ userData }) => {
	if (userData) {
		const [alertMessage, setAlertMessage] = useState(null);

		// collections data
		const [collections, setCollections] = useState(userData.collections);

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


					<section id="collections-section">
						<h1>My Collections</h1>
						<CollectionsContainer 
						setAlertMessage={setAlertMessage}
						collections={collections}
						setCollections={setCollections} />
					</section>
				</section>

				<Alert alertMessage={alertMessage} setAlertMessage={setAlertMessage} />
			</Layout>
		);
	}
	// handle when no userContext received
	else return (
		<p>No user object received.</p>
	);
};

// returning the object of params for the component
myProfile.getInitialProps = async ({ query }) => query;

export default myProfile