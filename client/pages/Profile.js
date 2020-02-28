// Page of a profile that doesn't belong to the user

const Profile = ({ profileName }) => {
	console.log(profileName);

	return (
	  <div>
	    <p>Hello Other Profile</p>
	  </div>
	)
}

// returning the object of params for the component
Profile.getInitialProps = async ({ query }) => query;


export default Profile