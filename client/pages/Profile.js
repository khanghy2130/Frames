// Page of a profile that doesn't belong to the user

import PropTypes from "prop-types";


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


// check prop type
Profile.propTypes = {
  profileName: PropTypes.string.isRequired,
}

export default Profile