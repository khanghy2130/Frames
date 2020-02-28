module.exports = function(server, app){

	server.get('/profile/:profileName', (req, res) => {
		app.render(req, res, '/profile', { profileName: req.params.profileName });
	});

};