const dotenv = require('dotenv');
dotenv.config({ path: './.env' });
const assert = require('assert');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const port = process.env.PORT;
const bookRoutes = require('./app/router/book.routes');
const app = express();

// Only start up server if we have process.env loaded
assert.ok((typeof parseInt(process.env.PORT, 2) === 'number'
  && process.env.PORT !== undefined), 'process.env file has not been loaded or variable has not been set.');

const startServer = async () => {
  await
    app
      .use(cors())
      .use(bodyParser.urlencoded({ extended: true }))
      .use(bodyParser.json())
      .use('/api/', bookRoutes)
};

process.on('unhandledRejection', err => {
  process.exit(1);
});

let server = app.listen(port, () => {
  console.log(`Server listening on port ${port} at ${new Date()}`);
  startServer();
});

module.exports = {
  server: server,
  app: app
};
