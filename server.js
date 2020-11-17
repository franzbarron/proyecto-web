// Use .env file for environment variables. Comment the line before pushing to master just in case
require('dotenv').config();

// ===dependencies===
const express = require('express');
const hbs = require('hbs');
const path = require('path');
const passport = require('passport');
const cookieSession = require('cookie-session');

// ===Router files===
const approutes = require('./src/approutes');
const authroutes = require('./src/authroutes');

// ===app configuration===
const app = express();
app.set('view engine', 'hbs');
app.use(express.json());
app.use(
  cookieSession({
    name: 'ratec-session',
    keys: [process.env.COOKIE_KEY_1, process.env.COOKIE_KEY_2]
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use('/', approutes);
app.use('/auth', authroutes);
app.use(express.static('public'));

// ===handlebars configuration===
hbs.registerPartials(path.join(__dirname, 'views', 'partials'), (err) => {
  if (err) console.error(err);
});

hbs.registerHelper('numToStars', (num) => {
  rounded = Math.round(num);
  let str = '';
  if (rounded > 0) str += Array(rounded).fill('★').join('');
  if (rounded < 5)
    str += Array(5 - rounded)
      .fill('☆')
      .join('');
  return str;
});

hbs.registerHelper('parseDate', (date) =>
  date.toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
);

// ===app listener===
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});
