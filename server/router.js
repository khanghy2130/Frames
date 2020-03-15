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
		(async function(){
			// get current user info from database
			const userData = await db_methods.getCurrentUserData(req.userContext.userinfo);
			// successful fetch
			if (userData){
				app.render(req, res, '/authenticated/_myProfile', {
					userData : userData
				});
			}
			// unsuccessful fetch
			else {
				app.render(req, res, '/_explore', {
					userContext : req.userContext,
					serverMessage: "Error while fetching user data."
				});
			}
		})()
	});

	server.post('/myProfile/change_seed', oidc.ensureAuthenticated(), (req, res) => {
		// update avatar seed to current user
		db_methods.setAvatarSeed(req.userContext.userinfo, req.body.new_avatar_seed);
	});


	////// TEST ROUTES

	server.get('/myProfile_test', (req, res) => {
		app.render(req, res, '/authenticated/_myProfile', {
			userData : {
				okta_id: "5e6da9086c73b92d24dc95f1",
				display_name: "AwesomeUser52",
				avatar_seed: "138",
				collections: [],
				friends: []
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

	// Not Found Page (redirect to '/' with alert message)
	server.get('*', (req, res) => {
		app.render(req, res, '/_explore', { 
			userContext : req.userContext,
			serverMessage: "Page not found."
		});
	});

};