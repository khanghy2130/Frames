const mongoose = require("mongoose");

const GifSchema = new mongoose.Schema({
	url: String,
	title: String
});

module.exports = mongoose.model("Gif", GifSchema);