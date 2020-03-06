require('dotenv').config(); // read .env file
const PORT = process.env.PORT || 3000;

const express = require('express');
const graphqlHTTP = require("express-graphql");
const next = require('next');
const cors = require('cors');

const graphql_schema = require('./graphql_schema.js');

const dev = process.env.NODE_ENV === 'development';
const app = next({ dev, dir: './client' }); // dev mode and client directory
const handle = app.getRequestHandler();
const router = require('./router.js');

app.prepare()
.then(() => {
	const server = express();

	// Allow cross-origin
	server.use(cors());
	
	// graphql route
	server.use('/api/graphql', graphqlHTTP({
		schema : graphql_schema,
		graphiql: dev
	}));



	// profile route ///
	router(server, app);

	server.get('*', (req, res) => {
		return handle(req, res);
	});

	server.listen(PORT, (err) => {
		if (err) throw err;
		console.log('> Ready on http://localhost:' + PORT);
	});
})
.catch((ex) => {
	console.error(ex.stack);
	process.exit(1);
});
