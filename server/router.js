// object with methods dealing with database
const db_methods = require('./database_methods.js');

module.exports = function(server, app, oidc){

	// root route will render /explore
	server.get("/", (req, res) => {
		// check to create new user (if logged in)
		if (req.isAuthenticated()){
			// async iife
			(async function(){
				const msg = await db_methods.checkCreateNewUser(req.userContext.userinfo);

				if (msg){
					app.render(req, res, '/_explore', {
						userContext : req.userContext,
						serverMessage: msg
					});
				} 
				// user already exists
				else {
					app.render(req, res, '/_explore', {
						userContext : req.userContext
					});
				}
			})()
		}
		// unauthenticated
		else {
			app.render(req, res, '/_explore', {
				userContext: null
			});
		}
	});


	// AUTHENTICATION NEEDED ROUTES

	server.get('/myProfile', oidc.ensureAuthenticated(), (req, res) => {
		app.render(req, res, '/authenticated/_myProfile', {
			userContext : req.userContext
		});
	});




	////// TEST ROUTES

	server.get('/getuser', (req, res) => {
		res.send(req.userContext);
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

	// Not Found Page (redirect to '/' with alert message)
	server.get('*', (req, res) => {
		app.render(req, res, '/_explore', { 
			userContext : req.userContext,
			serverMessage: "Page not found."
		});
	});

};