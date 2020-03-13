const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
	okta_id: String,
	display_name: String,
	avatar_seed: String,
	pro: Boolean,

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
			user: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'User',
			},
			status: Number,
			enums: [
				0,    //'add friend',
				1,    //'requested',
				2,    //'pending',
				3,    //'friends'
			]
		}
	]
});

module.exports = mongoose.model("User", UserSchema);