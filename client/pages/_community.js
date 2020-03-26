// Page that shows all registered users

import Link from 'next/link';
import Layout from '../components/Layout.js';

import '../sass/pages/community.scss';


const UsersContainer = ({allUsers}) => {

	// binded with user object
	const userClicked = function() {
		window.open(`/profile/${this.okta_id}`,"_self")
	};

	return (
		<div id="users-container">
		{
			allUsers.map(user => (
				<div key={user._id}
				className="user-item" 
				onClick={userClicked.bind(user)}>
					<img alt="avatar"
						src={`https://avatars.dicebear.com/v2/avataaars/${user.avatar_seed}.svg`}
					/>
					<h3>{user.display_name}</h3>
				</div>
			))
		}
		</div>
	)
};

const community = ({ userContext, allUsers }) => {

	return (
  		<Layout
		mainCssId="community-main"
		pageTitle="Community"
		isAuthenticated={userContext ? true : false}>

			<h1>Community</h1>
			
			{
				(allUsers.length === 0) ? (
					<p id="no-users-text">No users found.</p>
				) : (<UsersContainer allUsers={allUsers} />)
			}
			

		</Layout>
	)
}

// returning the object of params for the component
community.getInitialProps = async ({ query }) => query;

export default community