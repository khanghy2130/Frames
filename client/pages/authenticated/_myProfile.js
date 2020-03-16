// Page of the user's profile

import Link from 'next/link';

import '../../sass/pages/myProfile.scss';
import Layout from '../../components/Layout.js';
import AvatarDiv from '../../components/myProfile/AvatarDiv.js';


const CollectionsContainer = ({collectionsList}) => {
	// when clicked on the binded collection
	const openCollection = function() {
		console.log(this.title);
	};

	// when clicked on the edit button
	const editCollection = function() {
		console.log("Editing " + this.title);
	};

	const addNewCollection = function(){
		console.log("Adding collection number " + (collectionsList.length+1));
	};

	return (
		<div id="collections-container">
			{ collectionsList.map(collection => (
				<div key={ collection._id } className="collection-item">
					<button className="collection-title"
					onClick={ openCollection.bind(collection) }>
						{ collection.title }
					</button>
					<button className="collection-edit"
					onClick={ editCollection.bind(collection) }>
						<i className="fas fa-cog"/>
					</button>
				</div>
			)) }

			<button id="create-collection-button"
			onClick={ addNewCollection }>
				<i className="fas fa-plus-circle"/>&nbsp;&nbsp;Create new collection
			</button>
		</div>
	);
};


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
						collectionsList={userData.collections} />
					</section>
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