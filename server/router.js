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

	server.post('/myProfile/create_collection', oidc.ensureAuthenticated(), (req, res) => {
		(async function(){
			// create new collection for user
			const newCollection = await db_methods.createNewCollection(req.userContext.userinfo)

			// send to client the newly created collection
			// err property as status of the response
			if (newCollection){
				res.send({err: false, newCollection});
			} else {
				res.send({err: true});
			}
		})()
	});

	server.post('/myProfile/remove_collection', oidc.ensureAuthenticated(), (req, res) => {
		db_methods.removeCollection(req.userContext.userinfo, req.body.collection_id);
	});

	server.post('/myProfile/update_collection', oidc.ensureAuthenticated(), (req, res) => {
		db_methods.updateCollection(req.body.collection_id, req.body.changes_data);
	});




	////// TEST ROUTES
	// unauthenticated myProfile route for quick styling test with dummy data
	server.get('/myProfile_test', (req, res) => {
		app.render(req, res, '/authenticated/_myProfile', {
			userData : {
				okta_id: "5e6da9086c73b92d24dc95f1",
				display_name: "AwesomeUser52",
				avatar_seed: "35957",
				collections: [
					{
						_id: "1",
						title: "Untitled Collection 1",
						visibility: 0,
						gifs: []
					},
					{
						_id: "2",
						title: "Untitled Collection 2",
						visibility: 1,
						gifs: []
					},
					{
						_id: "3",
						title: "Untitled Collection 3",
						visibility: 2,
						gifs: []
					}

				],
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