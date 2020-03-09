require('dotenv').config(); // read .env file
const PORT = process.env.PORT || 3000;

const express = require('express');
const graphqlHTTP = require("express-graphql");
const next = require('next');
const cors = require('cors');

const OIDCRouter = require('./OIDCRouter.js');
const graphql_schema = require('./graphql_schema.js');
const router = require('./router.js');

// setup
const dev = process.env.NODE_ENV === 'development';
const app = next({ dev, dir: './client' }); // dev mode and client directory
const handle = app.getRequestHandler();


app.prepare()
.then(() => {
	const server = express();

	// set up OIDC
	const oidc = OIDCRouter(server);

	// Allow cross-origin
	server.use(cors());
	// graphql route
	server.use('/api/graphql', graphqlHTTP({
		schema : graphql_schema,
		graphiql: dev
	}));


	// TEST IF LOGGED IN
	server.get("/in", (req, res) => {
		if (req.userContext) {
			console.log(req.userContext);
			res.send(`Hi ${req.userContext.userinfo.name}!`);
		} else {
			res.send('You are not logged in!');
		}
	});


	// profile route ///
	router(server, app);

	server.get('*', (req, res) => {
		return handle(req, res);
	});


	// START SERVER
	oidc.on('ready', () => {
		server.listen(PORT, (err) => {
			if (err) throw err;
			console.log('> Ready on http://localhost:' + PORT);
		});
	});

	oidc.on('error', err => {
	  console.log('Unable to configure ExpressOIDC', err);
	});
})
.catch((ex) => {
	console.error(ex.stack);
	process.exit(1);
});
