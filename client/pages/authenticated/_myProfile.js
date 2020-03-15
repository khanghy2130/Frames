// Page of the user's profile

import Link from 'next/link';

import '../../sass/pages/myProfile.scss';
import Layout from '../../components/Layout.js';
import AvatarDiv from '../../components/myProfile/AvatarDiv.js';

const myProfile = ({ userData }) => {
	if (userData) {
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
				</section>

				<section id="profile-contents-section">
					Work on the avatar changing :)
				</section>
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