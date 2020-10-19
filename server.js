// Use .env file for environment variables
require('dotenv').config();

const express = require('express');

const app = express();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log('Listening on http://localhost:3000');
});

app.get('/', (_, res) => {
  res.send('Hello, world!');
});
