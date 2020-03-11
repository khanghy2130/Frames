module.exports = function(server, app, oidc){

	// root route will render /explore
	server.get("/", (req, res) => {
		app.render(req, res, '/explore_page', { userContext : req.userContext });
	});


	// my profile page
	server.get('/myProfile', oidc.ensureAuthenticated(), (req, res) => {
		app.render(req, res, '/myProfile_page', { userContext : req.userContext });
	});


	server.get('/profile/:profileName', (req, res) => {
		app.render(req, res, '/profile_page', { profileName: req.params.profileName });
	});




	// Landing Page
	server.get('/landing', (req, res) => {
		app.render(req, res, '/landing_page')
	});

	// Not Found Page
	server.get('*', (req, res) => {
		app.render(req, res, '/_error', { userContext : req.userContext });
	});



};