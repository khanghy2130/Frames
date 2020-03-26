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
	//   make sure the authenticated user is the sender
	const checkSender = (senderId, currentUserId) => senderId === currentUserId;

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


	// Collections manipulation routes
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

	
	server.get('/get_my_collections', oidc.ensureAuthenticated(), (req, res) => {
		(async function(){
			const result = await db_methods.getMyCollections(req.userContext.userinfo);

			// result.err_message is defined if error occurred.
			// else: result.collections is defined
			return res.send(result);
		})()
	});

	server.post('/add_gif', oidc.ensureAuthenticated(), (req, res) => {
		db_methods.addGif(
			req.userContext.userinfo, 
			req.body.collection_id, 
			req.body.gifObj
		);
	});

	server.post('/delete_gif', oidc.ensureAuthenticated(), (req, res) => {
		db_methods.deleteGif(
			req.userContext.userinfo, 
			req.body.collection_id, 
			req.body.gifObj
		);
	});
	

	// Friendship manipulation routes

	server.post('/add_friend', oidc.ensureAuthenticated(), (req, res) => {
		if (!checkSender(req.userContext.userinfo.sub, req.body.sender_okta_id)){
			return console.log("Request sender is not the user.");
		}
		db_methods.addFriend(
			req.body.sender_okta_id, 
			req.body.other_user_okta_id
		);
	});
	server.post('/remove_friend', oidc.ensureAuthenticated(), (req, res) => {
		if (!checkSender(req.userContext.userinfo.sub, req.body.sender_okta_id)){
			return console.log("Request sender is not the user.");
		}
		db_methods.removeFriend(
			req.body.sender_okta_id, 
			req.body.other_user_okta_id
		);
	});
	server.post('/accept_friend', oidc.ensureAuthenticated(), (req, res) => {
		if (!checkSender(req.userContext.userinfo.sub, req.body.sender_okta_id)){
			return console.log("Request sender is not the user.");
		}
		db_methods.acceptFriend(
			req.body.sender_okta_id, 
			req.body.other_user_okta_id
		);
	});



	// NO AUTHENTICATION NEEDED ROUTES

	// view a collection
	server.get('/collection/:collection_id', (req, res) => {
		/* if the collection is ...
			owned by current user: no further checking needed
			public: no further checking needed
			friend-only: check is friend with owner
			private: check authenticated, own collection
		*/
		(async function(){
			const response = await db_methods.getCollection(req.userContext, req.params.collection_id);
			
			// dataResponse has err_message if error occurred
			// else: has collection and isOwner
			app.render(req, res, '/_collection', { 
				userContext : req.userContext,
				dataResponse: response
			});
		})()
	});

	// other user's profile route
	server.get('/profile/:okta_id', (req, res) => {
		// check if authenticated and match current user then redirect to /myProfile
		if (req.userContext && (req.params.okta_id === req.userContext.userinfo.sub)){
			return res.redirect("/myProfile");
		}
		
		(async function(){
			// get that user info from database
			// userData will have property friendshipStatus,
			//   which is from the perspective of current user
			const response = await db_methods.getOtherUserData(req.userContext, req.params.okta_id);

			// successful fetch
			if (response){
				app.render(req, res, '/_profile', {
					userContext : req.userContext,
					userData : response.userData,
					friendshipStatus: response.friendshipStatus
				});
			}
			// unsuccessful fetch (user doesn't exist, etc)
			else {
				app.render(req, res, '/_explore', {
					userContext : req.userContext,
					serverMessage: "Error while fetching user data."
				});
			}
		})()
	});

	server.get('/community', (req, res) => {
		(async function(){
			// get all users info from database
			const communityData = await db_methods.getCommunityData();
			// successful fetch
			if (communityData){
				app.render(req, res, '/_community', {
					userContext : req.userContext,
					allUsers: communityData
				});
			}
			// unsuccessful fetch
			else {
				app.render(req, res, '/_explore', {
					userContext : req.userContext,
					serverMessage: "Error while fetching community data."
				});
			}
		})()
	});

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