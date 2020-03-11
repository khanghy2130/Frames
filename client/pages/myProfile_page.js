// Page of the user's profile

const myProfile = ({ userContext }) => {
	if (userContext) return (
		<div>
			<p>My name: {userContext.userinfo.name}</p>
		</div>
	);
	// no userContext?
	else return (
		<p>No user object received.</p>
	);
};

// returning the object of params for the component
myProfile.getInitialProps = async ({ query }) => query;

export default myProfile