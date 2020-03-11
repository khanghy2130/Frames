module.exports = function(server, app, oidc){

	// root route will render /explore
	server.get("/", (req, res) => {
		app.render(req, res, '/explore', { userContext : req.userContext });
	});


	// my profile page
	server.get('/myProfile', oidc.ensureAuthenticated(), (req, res) => {
		app.render(req, res, '/myProfile', { userContext : req.userContext });
	});


	server.get('/profile/:profileName', (req, res) => {
		app.render(req, res, '/profile', { profileName: req.params.profileName });
	});




	// Landing Page
	server.get('/landing', (req, res) => {
		app.render(req, res, '/landing')
	});

	// Not Found Page
	server.get('*', (req, res) => {
		app.render(req, res, '/_error', { userContext : req.userContext });
	});



};