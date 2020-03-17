const mongoose = require("mongoose");

const CollectionSchema = new mongoose.Schema({
	owner_okta_id: String,
	title: String,
	visibility: Number, // 0: private; 1: friends-only; 2: public
	gifs: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Gif"
		}
	]
});

module.exports = mongoose.model("Collection", CollectionSchema);