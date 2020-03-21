import axios from "axios";
import Link from "next/link";

const FriendsContainer = ({ userData, friends, setFriends }) => {
	// actions, binded with friendObj ////// setFriends() to change state
	const acceptFriend = function() {
		// update display
		const newFriendsArray = friends.map(friendObj => {
			// change friendship_status on target
			if (friendObj === this){
				friendObj.friendship_status = 3; // friend added!
				return friendObj;
			}
			else return friendObj; // not target friendOBj
		});
		setFriends(newFriendsArray);
		
		// sending request to accept friend
		axios.post('/accept_friend', {
			sender_okta_id: userData.okta_id,
			other_user_okta_id: this.user.okta_id
		}).catch(err => {console.log(err)});
		
	};
	const removeFriend = function() {
		// update display
		const newFriendsArray = friends.map(friendObj => {
			// change friendship_status on target
			if (friendObj === this){
				friendObj.friendship_status = 0; // friend removed!
				return friendObj;
			}
			else return friendObj; // not target friendOBj
		});
		setFriends(newFriendsArray);
		
		// sending request to remove friend
		axios.post('/remove_friend', {
			sender_okta_id: userData.okta_id,
			other_user_okta_id: this.user.okta_id
		}).catch(err => {console.log(err)});
	};


	// Filtering: Requests received, Requests sent, and Friends Added
	const RR = friends.filter(friendObj => {
		return friendObj.friendship_status === 2; // received
	});
	const RS = friends.filter(friendObj => {
		return friendObj.friendship_status === 1; // sent
	});
	const FA = friends.filter(friendObj => {
		return friendObj.friendship_status === 3; // friended
	});
	
	return (
		<div id="friends-container">
			<h3 className="sub-header">
				<i className="fas fa-exclamation-circle"/>&nbsp;&nbsp;Requests received
			</h3>
			{	
				(RR.length === 0) ?
					<p className="empty-placeholder">No requests received.</p>
				:
				(RR.map(friendObj => (
					<div className="friend-item" key={friendObj.user.okta_id}>
						<img alt="avatar"
						src={`https://avatars.dicebear.com/v2/avataaars/${friendObj.user.avatar_seed}.svg`} />
						<div>
							<Link href={`/profile/${friendObj.user.okta_id}`}>
								<a>{friendObj.user.display_name}</a>
							</Link>
							<div>
								<button className="green-btn"
								onClick={acceptFriend.bind(friendObj)}>
									Accept
								</button>
								<button className="red-btn"
								onClick={removeFriend.bind(friendObj)}>
									Decline
								</button>
							</div>
						</div>
					</div>
				)))
			}

			<h3 className="sub-header">
				<i className="fas fa-ellipsis-h"/>&nbsp;&nbsp;Requests sent
			</h3>
			{	
				(RS.length === 0) ?
					<p className="empty-placeholder">No requests sent.</p>
				:
				(RS.map(friendObj => (
					<div className="friend-item" key={friendObj.user.okta_id}>
						<img alt="avatar"
						src={`https://avatars.dicebear.com/v2/avataaars/${friendObj.user.avatar_seed}.svg`} />
						<div>
							<Link href={`/profile/${friendObj.user.okta_id}`}>
								<a>{friendObj.user.display_name}</a>
							</Link>
							<div>
								<button className="red-btn"
								onClick={removeFriend.bind(friendObj)}>
									Cancel
								</button>
							</div>
						</div>
					</div>
				)))
			}

			<h3 className="sub-header">
				<i className="fas fa-user-friends"/>&nbsp;&nbsp;Friends added
			</h3>
			{	
				(FA.length === 0) ?
					<p className="empty-placeholder">No friends added.</p>
				:
				(FA.map(friendObj => (
					<div className="friend-item" key={friendObj.user.okta_id}>
						<img alt="avatar"
						src={`https://avatars.dicebear.com/v2/avataaars/${friendObj.user.avatar_seed}.svg`} />
						<div>
							<Link href={`/profile/${friendObj.user.okta_id}`}>
								<a>{friendObj.user.display_name}</a>
							</Link>
							<div>
								<button className="red-btn"
								onClick={removeFriend.bind(friendObj)}>
									Unfriend
								</button>
							</div>
						</div>
					</div>
				)))
			}
		</div>
	);
};

export default FriendsContainer