const mongoose = require("mongoose");

// models
const User = require("./models/user.js");
const Collection = require("./models/collection.js");


module.exports = {

	// /explore route
	// check to add the user to Users collection
	// resolve null means user exists
	checkCreateNewUser: function(userinfo) {
		return new Promise( async function(resolve) {
			const userExists = await User.exists({okta_id: userinfo.sub});

			if (userExists) resolve(null);
			else {

				User.create( {
					okta_id: userinfo.sub,
					display_name: userinfo.name,
					avatar_seed: "138",
					collections: [],
					friends: []
				}, function (err, createdUser) {
					if (err) resolve("Error while creating user.");
					else resolve("Your profile has been created!");
				});

			}
		})
	},

	// /myProfile route
	// get data of the currently logged in user
	getCurrentUserData: function(userinfo){
		return new Promise( function (resolve){
			// get userData with populated collections and friends arrays
			User.findOne({okta_id: userinfo.sub})
			.populate("collections")
			.exec(function(err, foundUser){
				if (err) resolve(null);
				else resolve(foundUser);
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
				if (err) resolve(null);

				// STEP 2: create a collection
				Collection.create( {
					owner_okta_id: foundUser.okta_id, 
					title: 	`Untitled collection ${foundUser.collections.length + 1}`,
					visibility: 2,
					gifs: []
				}, function (err, createdCollection) {
					if (err) resolve(null);
					
					// STEP 3: give the user and save
					foundUser.collections.push(createdCollection);
					foundUser.save();
					resolve(createdCollection); // done, now return to client
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

	// /get_collection/:collection_id   GET route.
	// client would filter out unaccessible collections but this implements another layer of security 
	// response contains err_message or collection
	getCollection: function(userContext, collection_id){
		return new Promise( function (resolve){
			Collection.findById(collection_id, function(err, foundCollection){
				if (err) resolve({err_message: err.message});

				// if visibility is public then no further checking needed
				if (foundCollection.visibility === 2){
					resolve({collection: foundCollection});
				}
				else {
					// not a public collection, check logged in
					if (!userContext) resolve({err_message: 'Not logged in.'});

					// check if user owns this collection (no matter private or friend-only)
					if (foundCollection.owner_okta_id === userContext.userinfo.sub){
						resolve({collection: foundCollection});
					}

					// not owner? find real owner
					User.find({ okta_id: foundCollection.owner_okta_id },
					function(err, foundOwner){
						if (err) resolve({err_message: err.message});

						// check if user is friend with the real owner
						if (false){
							// send collection ///////////////////////////////
						}
						resolve({err_message: "Not friend with owner."});
					});
				}
			});
		});
	}


};