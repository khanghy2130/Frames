const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
	okta_id: String,
	display_name: String,
	avatar_seed: String,

	collections: [
		// item: collection object
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Collection"
		}
	],

	friends: [
		// item: friend object
		{
			/*
				0: not friends (this value wouldn't be stored)
				1: this user sent the request
				2: this user received the request
				3: friends

			*/
			friendship_status: Number,
			user: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'User'
			}
		}
	]
});

module.exports = mongoose.model("User", UserSchema);