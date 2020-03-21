import axios from "axios";
import { useState } from 'react';


const FriendButton = ({ userContext, userData, setAlertMessage, fStatus, setFStatus }) => {
	const unauthenticatedHandler = () => {
		setAlertMessage("Please log in to add friend.");
	};
	const addFriendHandler = () => {
		setFStatus(1); // request sent
		
		// request to add this user as friend
		axios.post('/add_friend', {
			sender_okta_id: userContext.userinfo.sub,
			other_user_okta_id: userData.okta_id
		})
		.catch(err => {console.log(err)});
	};

	// authenticated?
	if (userContext){
		// request sent
		if (fStatus === 1){
			return (
				<button id="add-friend-button" 
				disabled>
					Friend request sent
				</button>
			);
		}
		// received
		else if (fStatus === 2){
			return (
				<button id="add-friend-button" 
				disabled>
					Friend request received
				</button>
			);
		}
		// are friends
		else if (fStatus === 3){
			return (
				<button id="add-friend-button" 
				disabled>
					Friend added
				</button>
			);
		}
		// not friends
		else {
			return (
				<button id="add-friend-button" 
				onClick={addFriendHandler}
				className="enabled">
					Add friend
				</button>
			);
		}
	}
	// unauthenticated?
	else {
		return (
			<button id="add-friend-button" 
			onClick={unauthenticatedHandler}
			className="enabled">
				Add Friend
			</button>
		);
	}		
};

export default FriendButton;