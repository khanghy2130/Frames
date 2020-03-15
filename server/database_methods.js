// models
const User = require("./models/user.js");


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
			User.findOne({
				okta_id: userinfo.sub
			}, function(err, foundUser){
				if (err) resolve(null);
				else resolve(foundUser);
			});
		});
	},

	// /myProfile/change_seed route
	setAvatarSeed: function(userinfo, new_avatar_seed){
		// find, update, then save
		User.findOne({
			okta_id: userinfo.sub
		}, function(err, foundUser){
			if (err) return console.log(err);
			foundUser.avatar_seed = new_avatar_seed;
			foundUser.save();
		});
	}

};