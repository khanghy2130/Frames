module.exports = function(server, app, oidc){

	// root route will render /explore
	server.get("/", (req, res) => {
		app.render(req, res, '/_explore', { userContext : req.userContext });
	});


	// my profile page https://dev-392439.okta.com/api/v1/users/me
	server.get('/myProfile', oidc.ensureAuthenticated(), (req, res) => {
		app.render(req, res, '/_myProfile', { userContext : req.userContext });
	});


	server.get('/profile/:profileName', (req, res) => {
		app.render(req, res, '/_profile', { profileName: req.params.profileName });
	});




	// Landing Page
	server.get('/landing', (req, res) => {
		app.render(req, res, '/_landing')
	});

	// Not Found Page
	server.get('*', (req, res) => {
		app.render(req, res, '/_error');
	});



};