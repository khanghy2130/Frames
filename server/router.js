// models
const User = require("./models/user.js");

module.exports = function(server, app, oidc){

	// root route will render /explore
	server.get("/", (req, res) => {
		app.render(req, res, '/_explore', { userContext : req.userContext });
	});


	// AUTHENTICATION NEEDED ROUTES

	// my profile page https://dev-392439.okta.com/api/v1/users/me
	server.get('/myProfile', oidc.ensureAuthenticated(), (req, res) => {
		app.render(req, res, '/authenticated/_myProfile', { userContext : req.userContext });
	});




	////// TEST ROUTES
	server.get('/createuser', (req, res) => {
		User.create( {
			okta_id: "okta id yes",
			display_name: "userTester01",
			avatar_seed: "2664823",
			pro: true,
			collections: [],
			friends: []
		}, function (err, createdUser) {
			if (err) {
				console.log(err);
				// set alert FAILED TO CREATE USER
				res.send('FAILED TO CREATE USER');
			}
			else {
				res.send('User created');
			}
		});
		
	});


	// NO AUTHENTICATION NEEDED ROUTES

	// Other User's Profile
	server.get('/profile/:profileName', (req, res) => {
		// redirect to myProfile if looking at self //////////
		app.render(req, res, '/_profile', { profileName: req.params.profileName });
	});

	// Landing Page
	server.get('/landing', (req, res) => {
		app.render(req, res, '/_landing')
	});

	// Not Found Page
	server.get('*', (req, res) => {
		app.render(req, res, '/_explore', { 
			userContext : req.userContext,
			errorMessage: "Page not found."
		});
	});

};