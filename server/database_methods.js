const mongoose = require("mongoose");

// models
const User = require("./models/user.js");
const Collection = require("./models/collection.js");
const Gif = require("./models/gif.js");


module.exports = {

	// /explore route
	// check to add the user to Users collection
	// resolve null means user exists
	checkCreateNewUser: function(userinfo) {
		return new Promise( async function(resolve) {
			const userExists = await User.exists({okta_id: userinfo.sub});

			if (userExists) return resolve(null);

			User.create( {
				okta_id: userinfo.sub,
				display_name: userinfo.name,
				avatar_seed: "138",
				collections: [],
				friends: []
			}, function (err, createdUser) {
				if (err) return resolve("Error while creating user.");
				else return resolve("Your profile has been created!");
			});
		})
	},

	// /myProfile GET route 
	// get data of the currently logged in user
	getCurrentUserData: function(userinfo){
		return new Promise( function (resolve){
			User.findOne({okta_id: userinfo.sub})
			.populate("collections")
			.populate({
				path: 'friends.user',
				model: 'User'
			})
			.exec(function(err, foundUser){
				if (err) return resolve(null);
				else return resolve(foundUser);
			});
		});
	},

	// /myProfile/change_seed POST route
	setAvatarSeed: function(userinfo, new_avatar_seed){
		// find, update, then save
		User.findOne({okta_id: userinfo.sub}, function(err, foundUser){
			if (err) return console.log(err);
			foundUser.avatar_seed = new_avatar_seed;
			foundUser.save();
		});
	},


	// /myProfile/create_collection POST route
	createNewCollection: function(userinfo){
		return new Promise( function (resolve){
			// STEP 1: find the user
			User.findOne({okta_id: userinfo.sub}, function(err, foundUser) {
				if (err) return resolve(null);

				// STEP 2: create a collection
				Collection.create( {
					owner_okta_id: foundUser.okta_id, 
					title: 	`Untitled collection ${foundUser.collections.length + 1}`,
					visibility: 2,
					gifs: []
				}, function (err, createdCollection) {
					if (err) return resolve(null);
					
					// STEP 3: give the user and save
					foundUser.collections.push(createdCollection);
					foundUser.save();
					return resolve(createdCollection); // done, now return to client
				});
			});	
		});
	},

	// /myProfile/remove_collection POST route
	removeCollection: function(userinfo, collection_id){
		// get current userData
		User.findOne({okta_id: userinfo.sub}, function(err, foundUser) {
			if (err) return console.log(err);

			// remove the collection from userData
			foundUser.collections.pull(collection_id);
			foundUser.save();

			// remove the collection
			Collection.deleteOne({ _id: collection_id }, function(err) {
				if (err) return console.log(err);
			});
		});
	},

	// /myProfile/update_collection POST route
	updateCollection: function(collection_id, changes_data){
		// no need to get userData, just update the collection
		Collection.findById(collection_id, function(err, foundCollection){
			if (err) return console.log(err);

			foundCollection.title = changes_data.title;
			foundCollection.visibility = changes_data.visibility;
			foundCollection.save();
		});
	},


	// /get_collection/:collection_id   GET route (protected)
	// response contains err_message or collection
	getCollection: function(userContext, collection_id){
		return new Promise( function (resolve){
			Collection.findById(collection_id)
			.populate("gifs")
			.exec(function(err1, foundCollection){
				if (err1) return resolve({err_message: err1.message});
				if (foundCollection === null) return resolve({
					err_message: "Collection not found."
				});

				// if visibility is public then no further checking needed
				if (foundCollection.visibility === 2){
					return resolve({collection: foundCollection}); // public!
				}
				else {
					// not a public collection, check if logged in
					if (!userContext) return resolve({
						err_message: 'Not logged in.'
					});

					// check if user owns this collection (no matter private or friend-only)
					if (foundCollection.owner_okta_id === userContext.userinfo.sub){
						return resolve({collection: foundCollection}); // owner!
					}

					// user is not the owner of this collection!
					// is private collection?
					if (foundCollection.visibility === 0){
						return resolve({
							err_message:"Not owner of this private collection."
						});
					}
					// is friend-only collection
					else {
						// find the owner with the query that makes sure ...
						// ... the owner is friend with the current user
						User.findOne({ okta_id: foundCollection.owner_okta_id })
						.populate("friends.user")
						.exec(function(err2, foundOwner){
							if (err2) return resolve({err_message: err2.message});
							if (foundOwner === null) return resolve({
								err_message: "Owner not found."
							});

							// check if current user is friend with owner
							for (let i=0; i < foundOwner.friends.length; i++){
								const friendObj = foundOwner.friends[i];
								if (friendObj.user.okta_id === userContext.userinfo.sub
									&& friendObj.friendship_status === 3){
									return resolve({collection: foundCollection}); // friended!
								}
							}
							
							return resolve({
								err_message: "Not friend with the collection owner."
							});
						});
					}
				}
			});
		});
	},


	// /profile/:user_id GET route
	// the response also includes friendshipStatus and filters out unaccessible collections
	getOtherUserData: function(userContext, okta_id){
		return new Promise( function (resolve){
			// STEP 1: get other user data
			User.findOne({okta_id: okta_id})
			.populate("collections")
			.exec(function(err1, foundUser){
				if (err1) return resolve(null);
				if (foundUser === null) return resolve(null);

				// unauthenticated?
				if (!userContext){
					// filter out all non public collections
					foundUser.collections = foundUser.collections.filter(
						c => c.visibility === 2
					);
					return resolve({userData: foundUser, friendshipStatus : 0});
				} 
				else {
					// STEP 2: get CURRENT user data
					User.findOne({okta_id: userContext.userinfo.sub},
					function(err2, currentUser){
						if (err2) return resolve(null);
						if (currentUser === null) return resolve(null);

						// STEP 3: get friendship status
						let friendshipStatus = null;
						for (let i=0; i < currentUser.friends.length; i++){
							const friendObj = currentUser.friends[i];
							// this friend object is for this found user?
							if (foundUser._id.equals(friendObj.user)){
								friendshipStatus = friendObj.friendship_status;
								break;
							}
						}

						// STEP 4: filter out inaccessible collections
						foundUser.collections = foundUser.collections.filter(c => {
							// if is public
							if (c.visibility === 2) return true;

							// if is private
							if (c.visibility === 0) return false;

							// if is friends-only
							return friendshipStatus === 3; // friend added?
						});
						
						return resolve({userData: foundUser, friendshipStatus});
					});
				}
			});
		});
	},

	// /add_friend POST route
	addFriend: function(sender_okta_id, other_user_okta_id){
		// to make sure to not add the same friend object, run removeFriend() first
		// passing addFriendCallback
		this.removeFriend(
			sender_okta_id, 
			other_user_okta_id, 
			function(currentUser, otherUser){
				// adding friend object to current user
				currentUser.friends.push({
					friendship_status: 1, // request sent
					user: otherUser
				});
				currentUser.save();

				// adding friend object to current other user
				otherUser.friends.push({
					friendship_status: 2, // request received
					user: currentUser
				});
				otherUser.save();
			}
		);
	},

	// /remove_friend POST route
	// from either user at any status except no-friends status
	// a helper function for addFriend()
	removeFriend(okta_id_1, okta_id_2, addFriendCallback){
		User.findOne({okta_id: okta_id_1}, function(err1, user1){
			if (err1) return console.log(err1);
			User.findOne({okta_id: okta_id_2}, function(err2, user2){
				if (err2) return console.log(err2);
				
				// find and remove friend object of each other
				for (let i=0; i < user1.friends.length; i++){
					// found target friendObj?
					if (user1.friends[i].user.equals(user2._id)){
						user1.friends.splice(i, 1); // remove friendObj
						break;
					}
				}
				for (let i=0; i < user2.friends.length; i++){
					// found target friendObj?
					if (user2.friends[i].user.equals(user1._id)){
						user2.friends.splice(i, 1); // remove friendObj
						break;
					}
				}

				// continue to addFriend(), which will do the saving
				if (addFriendCallback){
					addFriendCallback(user1, user2); // sender and other user respectively
				}
				// if not, save right here
				else {
					user1.save();
					user2.save();
				}
			});
		});
	},

	// /accept_friend POST route
	acceptFriend: function(okta_id_1, okta_id_2){
		User.findOne({okta_id: okta_id_1}, function(err1, user1){
			if (err1) return console.log(err1);
			User.findOne({okta_id: okta_id_2}, function(err2, user2){
				if (err2) return console.log(err2);

				// find friendObj of each other to update friendship_status
				for (let i=0; i < user1.friends.length; i++){
					// found target friendObj?
					if (user1.friends[i].user.equals(user2._id)){
						user1.friends[i].friendship_status = 3;
						break;
					}
				}
				for (let i=0; i < user2.friends.length; i++){
					// found target friendObj?
					if (user2.friends[i].user.equals(user1._id)){
						user2.friends[i].friendship_status = 3;
						break;
					}
				}

				user1.save();
				user2.save();
			});
		});
	}

};