module.exports = function(server, app, oidc){

	// root route will render /explore
	server.get("/", (req, res) => {
		app.render(req, res, '/explore', { userContext : req.userContext });
	});

	// my profile page
	server.get('/myProfile', oidc.ensureAuthenticated(), (req, res) => {
		app.render(req, res, '/myProfile', { myName: req.userContext.name });
	});

	server.get('/profile/:profileName', (req, res) => {
		app.render(req, res, '/profile', { profileName: req.params.profileName });
	});

};