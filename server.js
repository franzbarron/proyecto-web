// Use .env file for environment variables
require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const path = require('path');

const app = express();
app.set('view engine', 'hbs');

hbs.registerPartials(path.join(__dirname, 'views', 'partials'), (err) => {
  if (err) console.error(err);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});

app.get('/', (_, res) => {
  res.render('index');
});

app.get('/home', (_, res) => {
  // placeholder data to send
  const data = {
    categories: [
      { name: 'lorem' },
      { name: 'ipsum' },
      { name: 'dolor' },
      { name: 'sit' },
      { name: 'amet' }
    ]
  };
  res.render('home', data);
});
