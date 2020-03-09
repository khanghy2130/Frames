const session = require('express-session');
const { ExpressOIDC } = require('@okta/oidc-middleware');

module.exports = (server) => {
	// session support is required to use ExpressOIDC
	server.use(session({
	  secret: 'more than meet the eyes',
	  resave: true,
	  saveUninitialized: false
	}));

	const oidc = new ExpressOIDC({
		appBaseUrl:process.env.OIDC_appBaseUrl,
		issuer: process.env.OIDC_issuer,
		client_id: process.env.OIDC_client_id,
		client_secret: process.env.OIDC_client_secret,
		redirect_uri: process.env.OIDC_redirect_uri,
		scope: 'openid profile'
	});

	// ExpressOIDC will attach handlers for the /login and /authorization-code/callback routes
	server.use(oidc.router);

	return oidc; // for the main js file
};

// Log out of Okta via POST request to /logout