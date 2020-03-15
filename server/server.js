require('dotenv').config(); // read .env file
const PORT = process.env.PORT || 3000;
const DBURL = process.env.DBURL || "mongodb://localhost:27017/test";

const express = require('express');
const mongoose = require('mongoose');
const graphqlHTTP = require("express-graphql");
const next = require('next');
const cors = require('cors');

// my modules
const OIDCRouter = require('./OIDCRouter.js');
const graphql_schema = require('./graphql_schema.js');
const router = require('./router.js');

// setup
const dev = process.env.NODE_ENV === 'development';
const app = next({ dev, dir: './client' }); // dev mode and client directory


app.prepare()
.then(() => {
	const server = express();

	// set up OIDC
	const oidc = OIDCRouter(server);

	// connect to mongoDB
	mongoose.connect(DBURL, {useNewUrlParser: true, useUnifiedTopology: true})
		.then(() => {
			console.log("Connected to DB");
		})
		.catch(err => {
			console.log("Failed to connect to DB: " + err.message);
		});

	
	server.use(cors()); // Allow cross-origin
	server.use(express.json()); // Parse JSON bodies from POST requests
	// graphql route
	server.use('/api/graphql', graphqlHTTP({
		schema : graphql_schema,
		graphiql: dev
	}));


	
	// profile route ///
	router(server, app, oidc);


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
