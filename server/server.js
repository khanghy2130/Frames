require('dotenv').config(); // read .env file
const express = require('express');
const next = require('next');
    
const dev = process.env.NODE_ENV === 'development';
const app = next({ dev, dir: './client' }); // devMode and client directory
const handle = app.getRequestHandler();
const router = require('./router.js');
    
app.prepare()
.then(() => {
  const server = express();

  router(server, app);
    
  server.get('*', (req, res) => {
    return handle(req, res);
  });
    
  server.listen(3000, (err) => {
    if (err) throw err;
    console.log('> Ready on http://localhost:3000');
  });
})
.catch((ex) => {
  console.error(ex.stack);
  process.exit(1);
});
